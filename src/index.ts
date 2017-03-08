import * as server from './server/server';
export interface ParamsInterface {
    resultObjErrorConstructor?: (msg: string, code?: number) => any
    resultObjSuccessConstructor?: (data: any, code?: number) => any
    dataFlagResolver?: DataFlagResolver
    reducerRoot: any
    routes: any
    createStore: any
}

export function start(params: ParamsInterface) {
    server.start(params);
}

export {default as BaseComponent} from './client/components/base-page';
export {createAction} from './utils/action-utils';
export {createReducer} from './utils/reducer-utils';
export {default as Storage} from './utils/storage';
export {default as getRequestMethod} from './utils/iso-request';