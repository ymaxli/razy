/**
 * @fileOverview action creator
 * @author Max
 **/

import { createAction as createFSA } from 'redux-actions';
import cloneDeep = require('lodash.clonedeep');
import merge = require('lodash.merge');

/**
 * enhance `redux-actions createAction` by adding a param `asyncCreator`,
 * work with `redux-validator redux-thunk redux-promise` middleware,
 * allow async promise to be created after validation 
 */
export function createAction(actionType: string, payloadCreator?: (...args: any[]) => any, metaCreator?: (...args: any[]) => any, asyncCreator?: (...args: any[]) => Promise<any>) {
    return (...args: any[]) => {
        let oriFSA: any = createFSA(actionType, payloadCreator, metaCreator)(...args);

        if (asyncCreator) {
            if (oriFSA.payload === undefined) {
                oriFSA.payload = {};
            } else if (typeof oriFSA.payload !== 'object') {
                oriFSA.payload = { payload: oriFSA.payload };
            }
            if(typeof oriFSA.meta !== 'object' && oriFSA.meta !== undefined) {
                oriFSA.meta = {meta: oriFSA.meta};
            }
            
            let oriPayload = cloneDeep(oriFSA.payload);
            oriFSA.payload.thunk = (dispatch: any) => {
                let asyncPayload = asyncCreator(...args);
                dispatch({
                    type: actionType,
                    payload: asyncPayload,
                    meta: merge(oriPayload, oriFSA.meta, { disableValidate: true })
                });
                return asyncPayload;
            };
        }

        return oriFSA;
    };
}
