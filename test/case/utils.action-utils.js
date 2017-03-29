/**
 * @fileOverview utils.action-utils test suite
 * @author Max
 **/

const assert = require('assert');
const ActionUtils = require('../../dist/utils/action-utils');
const createAction = ActionUtils.createAction;

describe('utils.action-utils', function () {
    it('without asyncCreator', function () {
        let action = createAction('test')({ a: 1, b: 2 });
        assert.deepEqual(action, { type: 'test', payload: { a: 1, b: 2 } });
    });
    it('with asyncCreator', function () {
        let asyncPromise = new Promise(function (resolve, reject) { });
        // no param
        let action1 = createAction('test', null, null, function () {
            return asyncPromise;
        })();
        assert(action1.type === 'test');
        assert(typeof action1.payload.thunk === 'function');
        let asyncPayload, dispatchObj;
        asyncPayload = action1.payload.thunk(function (obj) {
            dispatchObj = obj;
        });
        assert(asyncPayload === asyncPromise);
        assert.deepEqual(dispatchObj, {
            type: 'test',
            payload: asyncPromise,
            meta: { disableValidate: true }
        });

        // not obj param
        let action2 = createAction('test', null, null, function () {
            return asyncPromise;
        })(1);
        assert(action2.payload.payload === 1);
        let dispatchObj2;
        action2.payload.thunk(function (obj) {
            dispatchObj2 = obj;
        });
        assert.deepEqual(dispatchObj2, {
            type: 'test',
            payload: asyncPromise,
            meta: { payload: 1, disableValidate: true }
        });

        // meta creator
        let action3 = createAction('test', null, function (param) {
            return param;
        }, function () {
            return asyncPromise;
        })(1);
        assert.deepEqual(action3.meta, { meta: 1 });
        let dispatchObj3;
        action3.payload.thunk(function (obj) {
            dispatchObj3 = obj;
        });
        assert.deepEqual(dispatchObj3, {
            type: 'test',
            payload: asyncPromise,
            meta: { payload: 1, disableValidate: true, meta: 1 }
        });
    });
});