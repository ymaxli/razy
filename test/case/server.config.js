/**
 * @fileOverview server.config test suite
 * @author Max
 **/

const assert = require('assert');
const ConfigUtils = require('../../dist/server/config/utils');
const injectConfVariable = ConfigUtils.injectConfVariable;

const testObj = {
    'A': 1,
    'B': {
        "C": '222',
        "@D": 5,
        "E": {
            "F": 1
        }
    },
    "@C": {
        "K": 100
    }
};

describe('server.config', function() {
    it('normal', function() {
        injectConfVariable(testObj);
        assert(__A__ === 1);
        assert(__B_C__ === '222');
        assert(__B_D__ === 5);
        assert(__B_E_F__ === 1);
        assert(__C_K__ === 100);
    });
});