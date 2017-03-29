/**
 * @fileOverview server.stub test suite
 * @author Max
 **/

const assert = require('assert');
const Stub = require('../../dist/server/stub');
const handleStubReq = Stub.handleStubReq;

describe('server.stub', function() {
    before(function() {
        require('../../dist/server/config');
    });
    it('normal', function() {
        let content = handleStubReq('/a/b/c');
        assert.deepEqual(content, {
            "code": 0,
            "data": {
                "a": 123
            }
        });
    });
    it('not found', function() {
        let content = handleStubReq('/a/b');
        assert.deepEqual(content, {
            "code": 1,
            "msg": '404 Not Found'
        });
    });
});