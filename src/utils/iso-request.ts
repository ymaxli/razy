/**
 * @fileOverview isomorphic request method, compatible both in server and client side
 * @author Max
 */

import REQUEST from './request';

export default function getRequestMethod(dataFlagResolver?: DataFlagResolver): {
    http: REQUEST,
    https: REQUEST
} {
    if(typeof window === 'undefined') {
        const {initHTTP, initHTTPS} = require('./http');
        return {
            http: initHTTP({
                hostname: __API_SERVER_HTTP_HOSTNAME__,
                port: __API_SERVER_HTTP_PORT__,
                stubHostname: __STUB_SERVER_HTTP_HOSTNAME__,
                stubPort: __STUB_SERVER_HTTP_PORT__
            }, dataFlagResolver),
            https: initHTTPS({
                hostname: __API_SERVER_HTTP_HOSTNAME__,
                port: __API_SERVER_HTTP_PORT__,
                stubHostname: __STUB_SERVER_HTTP_HOSTNAME__,
                stubPort: __STUB_SERVER_HTTP_PORT__
            }, dataFlagResolver)
        }
    } else {
        const {initFetch} = require('./fetch');
        const fetch = initFetch({
            hostname: __API_SERVER_FETCH_HOSTNAME__,
            port: __API_SERVER_FETCH_PORT__,
            stubHostname: __STUB_SERVER_FETCH_HOSTNAME__,
            stubPort: __STUB_SERVER_FETCH_PORT__
        }, dataFlagResolver);
        return {
            http: fetch,
            https: fetch
        };
    }
}