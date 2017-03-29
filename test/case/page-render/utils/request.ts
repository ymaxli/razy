/**
 * @fileOverview request method
 * @author Max
 */

import * as http from 'http';
import * as URLModule from 'url';
import * as querystring from 'query-string';

export function httpGet(url, raw: boolean) {
    return new Promise((resolve, reject) => {
        http.get(`http://${url}`, res => {
            dataHandler(url, res, resolve, reject, raw);
        }).on('error', reject)
    });
}
export function httpPost(url, content, raw) {
    const _content = querystring.stringify(content);
    const urlObj = URLModule.parse(`http://${url}`);
    let _options: any = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': _content.length
        },
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.path
    };
    return new Promise((resolve, reject) => {
        const req = http.request(_options, res => {
            dataHandler(url, res, resolve, reject, raw);
        });

        req.on('error', reject);

        req.write(_content);
        req.end();
    });
}

function dataHandler(url, res, resolve, reject, raw: boolean) {
    res.setEncoding('utf8');
    let body = '';
    res.on('data', function (chunk) {
        body += chunk;
    });
    res.on('end', () => {
        if(raw) {
            resolve(body);
            return;
        }

        let json;
        try {
            json = JSON.parse(body);
        } catch (e) {
            console.error(body);
            reject(e);
            return;
        }


        if (json.code === 0) {
            resolve(json.data);
        } else {
            reject(json);
        }
    });
    res.on('error', reject);
}