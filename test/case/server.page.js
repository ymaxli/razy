/**
 * @fileOverview server.page test suite
 * @author Max
 **/

let expect = require('expect.js');
let PageUtils = require('../../dist/server/page/utils');
let exportConfigToGlobalConst = PageUtils.exportConfigToGlobalConst;

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

describe('server.page', function() {
    it('normal', function() {
        let result = exportConfigToGlobalConst(testObj);
        expect(result.__A__).to.be(1);
        expect(result.__B_C__).to.be('222');
        expect(result['__B_@D__']).to.be(undefined);
        expect(result.__B_E_F__).to.be(1);
        expect(result['__@C_K__']).to.be(undefined);
    });
});