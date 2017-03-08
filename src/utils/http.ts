/**
 * @fileOverview server-side http request, yield promise
 * @author Max
 */

import * as http from 'http';
import * as https from 'https';
import * as querystring from 'querystring';
import REQUEST from './request';
import * as URL from 'url';

export class HTTP_PARENT extends REQUEST {
    private method: any
    constructor(params: RequestParam, protocol: string, method: any, dataFlagResolver?: DataFlagResolver) {
        super(params, protocol, dataFlagResolver);
        this.protocol = protocol;
        this.method = method;
    }
    protected getPromise(url: string, raw?: boolean) {
        return new Promise((resolve, reject) => {
            console.log(`new ${this.protocol.toUpperCase()} GET:`, url);
            this.method.get(url, (res: any) => {
                this.dataHandler(url, res, resolve, reject, raw);
            }).on('error', reject);
        });
    }
    protected postPromise(url: string, content: any, options?: any, raw?: boolean) {
        const _content = querystring.stringify(content);
        const urlObj = URL.parse(url);
        let optionsReal = options || {};
        let _options = {
            method: 'POST',
            headers: {
                'Content-Type': optionsReal['Content-Type'] || 'application/x-www-form-urlencoded',
                'Content-Length': _content.length
            },
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.path
        };

        return new Promise((resolve, reject) => {
            console.log(`new ${this.protocol.toUpperCase()} POST:`, url);
            const req = this.method.request(_options, (res: any) => {
                this.dataHandler(url, res, resolve, reject, raw);
            });

            req.on('error', reject);

            req.write(_content);
            req.end();
        });
    }
    private dataHandler(url: string, res: any, resolve: Function, reject: Function, raw?: boolean) {
        res.setEncoding('utf8');
        let body = '';
        res.on('data', function(chunk: string) {
            body += chunk;
        });
        res.on('end', () => {
            let json: any;
            if(!raw) {
                try {
                    json = JSON.parse(body);
                } catch(e) {
                    console.error(body);
                    reject(e);
                    return;
                }
            } else {
                json = body;
            }

            if(!raw) {
                this.dataFlag(json, resolve, reject);
            } else {
                resolve(json);
            }
        });
        res.on('error', reject);
    }
}

export class HTTP extends HTTP_PARENT{
    constructor(params: any, dataFlagResolver?: DataFlagResolver) {
        super(params, 'http', http, dataFlagResolver);
        http.get
    }
}
export class HTTPS extends HTTP_PARENT {
    constructor(params: any, dataFlagResolver?: DataFlagResolver) {
        super(params, 'https', https, dataFlagResolver);
    }
}

let _http: HTTP, _https: HTTPS;
export const initHTTP = (params: RequestParam, dataFlagResolver?: DataFlagResolver) => {
    _http = new HTTP(params, dataFlagResolver); 
    return _http; 
};
export const initHTTPS = (params: RequestParam, dataFlagResolver?: DataFlagResolver) => {
    _https = new HTTPS(params, dataFlagResolver);  
    return _https;
};