/**
 * @fileOverview server.config test suite
 * @author Max
 **/

let expect = require('expect.js');
let ConfigUtils = require('../../dist/server/config/utils');
let injectConfVariable = ConfigUtils.injectConfVariable;

let testObj = {
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
        expect(__A__).to.be(1);
        expect(__B_C__).to.be('222');
        expect(__B_D__).to.be(5);
        expect(__B_E_F__).to.be(1);
        expect(__C_K__).to.be(100);
    });
});