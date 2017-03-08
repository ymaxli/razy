interface RequestParam {
    hostname: string,
    port: string,
    stubHostname: string,
    stubPort: string
}
interface DataFlagResolver {
    (obj: any, resolve: Function, reject: Function): void
}
declare abstract class REQUEST {
    constructor(param: RequestParam, protocol: string, dataflagResolver?: DataFlagResolver)
    /**
     * get method
     */
    get(url: string, raw?: boolean): Promise<any>
    /**
     * get method, automatically redirect to stub api
     */
    getStub(url: string): Promise<any>
    /**
     * post method
     */
    post(url: string, content: any, options?: any, raw?: boolean): Promise<any>
    /**
     * post method, automatically redirect to stub api
     */
    postStub(url: string, content: any): Promise<any>
    /**
     * add global param when sending any kind of request
     */
    setParam(key: string, value: any): void
}
