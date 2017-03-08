/**
 * @fileOverview server.utils.json-result test suite
 * @author Max
 **/

let expect = require('expect.js');
let JsonResult = require('../../dist/server/utils/json-result');

describe('server.utils.json-result', function() {
    it('default', function() {
        JsonResult.init();
        let errorObj = JsonResult.error('111');
        expect(errorObj).to.eql({code: 1, msg: '111'});

        let successObj = JsonResult.success({a:1});
        expect(successObj).to.eql({code: 0, data: {a: 1}});
    });
    it('pass code', function() {
        JsonResult.init();
        let errorObj = JsonResult.error('111', 100);
        expect(errorObj).to.eql({code: 100, msg: '111'});

        let successObj = JsonResult.success({a:1}, 201);
        expect(successObj).to.eql({code: 201, data: {a: 1}});
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
        expect(errorObj).to.eql({result_code: 100, message: '111'});

        let successObj = JsonResult.success({a:1}, 201);
        expect(successObj).to.eql({result_code: 201, content: {a: 1}});
    });
});