import * as server from './server/server';
import {DataFlagResolver} from './utils/request';
import {Express} from 'express';
export interface ParamsInterface {
    resultObjErrorConstructor?: (msg: string, code?: number) => any
    resultObjSuccessConstructor?: (data: any, code?: number) => any
    dataFlagResolver?: DataFlagResolver
    reducerRoot: any
    routes: any
    createStore: any
    serverInterceptor?: (app: Express) => void
}

export function start(params: ParamsInterface) {
    server.start(params, params.serverInterceptor);
}