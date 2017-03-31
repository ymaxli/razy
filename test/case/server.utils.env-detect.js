/**
 * @fileOverview server.utils.env-detect test suite
 * @author Max
 **/

const assert = require('assert');
const EnvDetect = require('../../dist/server/utils/env-detect');

describe('server.utils.env-detect', function() {
    it('server side dev // process.env.NODE_ENV injected by test commands', function() {
        assert(EnvDetect.dev() === true);
        assert(EnvDetect.notDev() === false);
        assert(EnvDetect.prod() === false);
        assert(EnvDetect.notProd() === true);
        assert(EnvDetect.test() === false);
        assert(EnvDetect.notTest() === true);
    });
    it('client side dev', function() {
        global.__NODE_ENV__ = 'dev';
        EnvDetect.modifyNodeEnvOnlyInTests({});
        
        assert(EnvDetect.dev() === true);
        assert(EnvDetect.notDev() === false);
        assert(EnvDetect.prod() === false);
        assert(EnvDetect.notProd() === true);
        assert(EnvDetect.test() === false);
        assert(EnvDetect.notTest() === true);

        global.__NODE_ENV__ = 'undefined';
        EnvDetect.modifyNodeEnvOnlyInTests();
    });
});