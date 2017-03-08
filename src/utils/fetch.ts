/**
 * @fileOverview client-side fetch request depending on fetch-ie8
 * @author Max
 **/

import * as URL from 'url';
import REQUEST from './request';
import * as querystring from 'query-string';

let _ajax: Fetch;

export class Fetch extends REQUEST{
    private fetch: any
    constructor(params: RequestParam, dataFlagResolver?: DataFlagResolver) {
        super(params, 'http', dataFlagResolver);

        const fetchPolyfill = require('fetch-ie8');
        this.fetch = window.fetch || fetchPolyfill;
    }
    protected getPromise(url: string, raw?: boolean) {
        return new Promise((resolve, reject) => {
            this.fetch.call(window, url)
            .then((response: any) => {
                return raw ? response.text() : response.json()
            })
            .then((data: any) => {
                this._handleData(url, data, resolve, reject, raw);
            }).catch((e: Error) => {
                console.error(e);
                reject(e);
            });
        });
    }
    protected postPromise(url: string, content: any, options?: any, raw?: boolean) {
        return new Promise((resolve, reject) => {
            this.fetch.call(window, url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: querystring.stringify(content)
            })
            .then((response: any) => {
                return raw ? response.text() : response.json()
            })
            .then((data: any) => {
                this._handleData(url, data, resolve, reject, raw);
            }).catch((e: Error) => {
                console.error(e);
                reject(e);
            });
        });
    }
    private _handleData(url: string, data: any, resolve: Function, reject: Function, raw?: boolean) {
        if(!raw) {
            this.dataFlag(data, resolve, reject);
        } else {
            resolve(data);
        }
    }
}

export const initFetch = (params: RequestParam, dataFlagResolver?: DataFlagResolver) => {
    _ajax = new Fetch(params, dataFlagResolver);  
    return _ajax;
};