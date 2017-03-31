/**
 * @fileOverview 统一HTTP网络请求父对象
 *               产出Promise对象
 *               自动解析JSON数据，服务器返回的数据结构顶层为{code: int(0为成功，其余为错误码), data/error}
 *               附带桩方法
 * @author Max
 **/

import * as URL from 'url';
export interface DataFlagResolver {
    (obj: any, resolve: Function, reject: Function): void
} 
export interface RequestParam {
    hostname: string,
    port: string,
    stubHostname: string,
    stubPort: string
}
abstract class REQUEST {
    protected hostname: string
    protected port: string
    protected stubHostname: string
    protected stubPort: string
    protected protocol: string
    protected params: any
    private dataFlagResolver: DataFlagResolver
    constructor(param: RequestParam, protocol: string, dataFlagResolver?: DataFlagResolver) {
        this.hostname = param.hostname;
        this.port = param.port;
        this.stubHostname = param.stubHostname;
        this.stubPort = param.stubPort;
        this.protocol = protocol;
        this.dataFlagResolver = dataFlagResolver;

        this.params = {};
    }
    protected abstract getPromise(url: string, raw?: boolean): Promise<any>
    protected abstract postPromise(url: string, content: any, options?: any, raw?: boolean): Promise<any>
    get(url: string, raw?: boolean) {
        const urlObj = URL.parse(encodeURI(url));
        let query = '';
        for(let i in this.params) {
            query += `${i}=${this.params[i]}&`;
        }
        query = query.substr(0, query.length - 1);
        if(query !== '') {
            urlObj.search = urlObj.search ? `${urlObj.search}&${query}` : `?${query}`;
        }

        return this.getPromise(this.urlFilter(URL.format(urlObj)), raw);
    }
    getStub(url: string) {
        return this.getPromise(this.urlStubFilter(encodeURI(url)));
    }
    post(url: string, content: any, options?: any, raw?: boolean) {
        for(let i in this.params) {
            content[i] = this.params[i];
        }

        return this.postPromise(this.urlFilter(encodeURI(url)), content, options, raw);
    }
    postStub(url: string, content: any) {
        return this.postPromise(this.urlStubFilter(encodeURI(url)), content);
    }
    setParam(key: string, value: any) {
        this.params[key] = value;
    }
    private urlFilter(url: string) {
        let result = url;
        const urlObj = URL.parse(url);
        if(urlObj.hostname === null && urlObj.port === null) {
            urlObj.hostname = this.hostname;
            urlObj.port = this.port;
            urlObj.protocol = this.protocol;
            urlObj.slashes = true;

            result = URL.format(urlObj);
        }

        return result;
    }
    private urlStubFilter(url: string) {
        let result = url;
        const urlObj = URL.parse(url);

        if(urlObj.hostname === null && urlObj.port === null) {
            urlObj.hostname = this.stubHostname;
            urlObj.port = this.stubPort;
            urlObj.protocol = this.protocol;
            urlObj.slashes = true;
            urlObj.pathname = '/stub' + urlObj.pathname;

            result = URL.format(urlObj);
        }

        return result;
    }
    protected dataFlag(obj: any, resolve: Function, reject: Function) {
        if(this.dataFlagResolver) {
            this.dataFlagResolver(obj, resolve, reject);
        } else {
            if(obj.code === 0) {
                resolve(obj.data);
            } else {
                reject(obj);
                // throw new Error(`request error: ${url}`);
            }
        }
    }
}

export default REQUEST;