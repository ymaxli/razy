/**
 * @fileOverview server.stub test suite
 * @author Max
 **/

let expect = require('expect.js');
let Stub = require('../../dist/server/stub');
let handleStubReq = Stub.handleStubReq;

describe('server.stub', function() {
    before(function() {
        require('../../dist/server/config');
    });
    it('normal', function() {
        let content = handleStubReq('/a/b/c');
        expect(content).to.eql({
            "code": 0,
            "data": {
                "a": 123
            }
        });
    });
    it('not found', function() {
        let content = handleStubReq('/a/b');
        expect(content).to.eql({
            "code": 1,
            "msg": '404 Not Found'
        });
    });
});