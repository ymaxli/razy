/**
 * @fileOverview server.utils.json-result test suite
 * @author Max
 **/

const assert = require('assert');
const JsonResult = require('../../dist/server/utils/json-result');

describe('server.utils.json-result', function() {
    it('default', function() {
        JsonResult.init();
        let errorObj = JsonResult.error('111');
        assert.deepEqual(errorObj, {code: 1, msg: '111'});

        let successObj = JsonResult.success({a:1});
        assert.deepEqual(successObj, {code: 0, data: {a: 1}});
    });
    it('pass code', function() {
        JsonResult.init();
        let errorObj = JsonResult.error('111', 100);
        assert.deepEqual(errorObj, {code: 100, msg: '111'});

        let successObj = JsonResult.success({a:1}, 201);
        assert.deepEqual(successObj, {code: 201, data: {a: 1}});
    });
    it('customize', function() {
        JsonResult.init({
            error: function(msg, code) {
                return {
                    message: msg,
                    result_code: code
                };
            },
            success: function(data, code) {
                return {
                    content: data,
                    result_code: code
                }
            }
        });

        let errorObj = JsonResult.error('111', 100);
        assert.deepEqual(errorObj, {result_code: 100, message: '111'});

        let successObj = JsonResult.success({a:1}, 201);
        assert.deepEqual(successObj, {result_code: 201, content: {a: 1}});
    });
});