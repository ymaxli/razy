/**
 * @fileOverview utils.validator test suite
 * @author Max
 **/

const assert = require('assert');
const Validator = require('../../dist/utils/validator');

describe('utils.validator', function () { 
    it('notEmptyValidator', function() {
        const notEmptyValidator = Validator.notEmptyValidator;
        assert(notEmptyValidator(1));
        assert(notEmptyValidator() === false);
        assert(notEmptyValidator(null) === false);
        assert(notEmptyValidator('') === false);
        assert(notEmptyValidator(NaN) === false);
        assert(notEmptyValidator([]) === false);
        assert(notEmptyValidator({}) === false);
        assert(notEmptyValidator({a:1}));
    });
    it('phoneValidator', function() {
        const phoneValidator = Validator.phoneValidator;
        assert(phoneValidator('13951893333'));
        assert(phoneValidator('1395189333') === false);
        assert(phoneValidator('123456') === false);
        assert(phoneValidator('023-2341') === false);
        assert(phoneValidator('32951893333') === false);
    });
    it('integerValidator', function() {
        const integerValidator = Validator.integerValidator;
        assert(integerValidator(1));
        assert(integerValidator(0));
        assert(integerValidator(1.1) === false);
        assert(integerValidator('1') === false);
    });
    it('floatValidator', function() {
        const floatValidator = Validator.floatValidator;
        assert(floatValidator(1.1));
        assert(floatValidator(1));
        assert(floatValidator('1.1') === false);
        assert(floatValidator(0.0));
    });
    it('booleanValidator', function() {
        const booleanValidator = Validator.booleanValidator;
        assert(booleanValidator(false));
        assert(booleanValidator(true));
        assert(booleanValidator(1) === false);
        assert(booleanValidator(0) === false);
        assert(booleanValidator('1') === false);
        assert(booleanValidator('0') === false);
    });
    it('arrayValidator', function() {
        const arrayValidator = Validator.arrayValidator;
        assert(arrayValidator([]));
        assert(arrayValidator({}) === false);
        assert(arrayValidator(1) === false);
    });
    it('URLValidator', function() {
        const URLValidator = Validator.URLValidator;
        assert(URLValidator('http://google.com'));
        assert(URLValidator('googlecom') === false);
        assert(URLValidator('http://go.c') === false);
        assert(URLValidator('https://go.cc'));
    });
});