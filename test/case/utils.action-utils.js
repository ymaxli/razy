/**
 * @fileOverview utils.action-utils test suite
 * @author Max
 **/

let expect = require('expect.js');
let ActionUtils = require('../../dist/utils/action-utils');
let createAction = ActionUtils.createAction;

describe('utils.action-utils', function () {
    it('without asyncCreator', function () {
        let action = createAction('test')({ a: 1, b: 2 });
        expect(action).to.eql({ type: 'test', payload: { a: 1, b: 2 } })
    });
    it('with asyncCreator', function () {
        let asyncPromise = new Promise(function (resolve, reject) { });
        // no param
        let action1 = createAction('test', null, null, function () {
            return asyncPromise;
        })();
        expect(action1.type).to.be('test');
        expect(action1.payload.thunk).to.be.a('function');
        let asyncPayload, dispatchObj;
        asyncPayload = action1.payload.thunk(function (obj) {
            dispatchObj = obj;
        });
        expect(asyncPayload).to.be(asyncPromise);
        expect(dispatchObj).to.eql({
            type: 'test',
            payload: asyncPromise,
            meta: { disableValidate: true }
        });

        // not obj param
        let action2 = createAction('test', null, null, function () {
            return asyncPromise;
        })(1);
        expect(action2.payload.payload).to.be(1);
        let dispatchObj2;
        action2.payload.thunk(function (obj) {
            dispatchObj2 = obj;
        });
        expect(dispatchObj2).to.eql({
            type: 'test',
            payload: asyncPromise,
            meta: { payload: 1, disableValidate: true }
        });

        // meta creator
        let action3 = createAction('test', null, function(param) {
            return param;
        }, function () {
            return asyncPromise;
        })(1);
        expect(action3.meta).to.eql({meta: 1});
        let dispatchObj3;
        action3.payload.thunk(function (obj) {
            dispatchObj3 = obj;
        });
        expect(dispatchObj3).to.eql({
            type: 'test',
            payload: asyncPromise,
            meta: { payload: 1, disableValidate: true, meta: 1 }
        });
    });
});