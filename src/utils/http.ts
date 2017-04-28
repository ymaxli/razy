/**
 * @fileOverview server-side http request, yield promise
 * @author Max
 */

import request = require('request');
import REQUEST from './request';
import { RequestParam, DataFlagResolver } from './request';

export class HTTP_PARENT extends REQUEST {
    constructor(params: RequestParam, protected protocol: string, dataFlagResolver?: DataFlagResolver) {
        super(params, protocol, dataFlagResolver);
    }
    protected getPromise(url: string, raw?: boolean) {
        return new Promise((resolve, reject) => {
            console.log(`new ${this.protocol.toUpperCase()} GET:`, url);
            request.get(url, (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    this.dataHandler(url, body, resolve, reject, raw);
                }
            })
        });
    }
    protected postPromise(url: string, content: any, options: any = {}, raw?: boolean) {
        return new Promise((resolve, reject) => {
            console.log(`new ${this.protocol.toUpperCase()} POST:`, url);
            request.post(Object.assign({
                uri: url,
                method: 'POST',
                form: content
            }, options), (err: any, res: any, body: any) => {
                if (err) {
                    reject(err);
                } else {
                    this.dataHandler(url, body, resolve, reject, raw, options.json ? true : false);
                }
            })
        });
    }
    private dataHandler(url: string, body: any, resolve: Function, reject: Function, raw?: boolean, noParse?: boolean) {
        let json: any;
        if (!raw && !noParse) {
            try {
                json = JSON.parse(body);
            } catch (e) {
                console.error(body);
                reject(e);
                return;
            }
        } else {
            json = body;
        }

        if (!raw) {
            this.dataFlag(json, resolve, reject);
        } else {
            resolve(json);
        }
    }
}

export class HTTP extends HTTP_PARENT {
    constructor(params: any, dataFlagResolver?: DataFlagResolver) {
        super(params, 'http', dataFlagResolver);
    }
}
export class HTTPS extends HTTP_PARENT {
    constructor(params: any, dataFlagResolver?: DataFlagResolver) {
        super(params, 'https', dataFlagResolver);
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