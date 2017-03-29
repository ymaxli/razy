/**
 * @fileOverview server.page test suite
 * @author Max
 **/

const assert = require('assert');
const PageUtils = require('../../dist/server/page/utils');
const exportConfigToGlobalConst = PageUtils.exportConfigToGlobalConst;

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

describe('server.page', function() {
    it('normal', function() {
        let result = exportConfigToGlobalConst(testObj);
        assert(result.__A__ === 1);
        assert(result.__B_C__ === '222');
        assert(result['__B_@D__'] === undefined);
        assert(result.__B_E_F__ === 1);
        assert(result['__@C_K__'] === undefined);
    });
});