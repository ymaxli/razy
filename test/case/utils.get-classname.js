/**
 * @fileOverview utils.get-classname test suite
 * @author Max
 **/

const assert = require('assert');
const getClassName = require('../../dist/utils/get-classname').default;

function Acc(props) {
    
}
function BddS(props) {
    
}

describe('utils.get-classname', function () {
    it('normal', function () {
        assert(getClassName(new Acc()) === 'Acc');
        assert(getClassName(new BddS(1, 2)) === 'BddS');
    });
});