/**
 * @fileOverview utils.validator test suite
 * @author Max
 **/

const expect = require('expect.js');
const Validator = require('../../dist/utils/validator');

describe('utils.validator', function () { 
    it('notEmptyValidator', function() {
        const notEmptyValidator = Validator.notEmptyValidator;
        expect(notEmptyValidator(1)).to.be(true);
        expect(notEmptyValidator()).to.be(false);
        expect(notEmptyValidator(null)).to.be(false);
        expect(notEmptyValidator('')).to.be(false);
        expect(notEmptyValidator(NaN)).to.be(false);
        expect(notEmptyValidator([])).to.be(false);
        expect(notEmptyValidator({})).to.be(false);
        expect(notEmptyValidator({a:1})).to.be(true);
    });
    it('phoneValidator', function() {
        const phoneValidator = Validator.phoneValidator;
        expect(phoneValidator('13951893333')).to.be(true);
        expect(phoneValidator('1395189333')).to.be(false);
        expect(phoneValidator('123456')).to.be(false);
        expect(phoneValidator('023-2341')).to.be(false);
        expect(phoneValidator('32951893333')).to.be(false);
    });
    it('integerValidator', function() {
        const integerValidator = Validator.integerValidator;
        expect(integerValidator(1)).to.be(true);
        expect(integerValidator(0)).to.be(true);
        expect(integerValidator(1.1)).to.be(false);
        expect(integerValidator('1')).to.be(false);
    });
    it('floatValidator', function() {
        const floatValidator = Validator.floatValidator;
        expect(floatValidator(1.1)).to.be(true);
        expect(floatValidator(1)).to.be(true);
        expect(floatValidator('1.1')).to.be(false);
        expect(floatValidator(0.0)).to.be(true);
    });
    it('booleanValidator', function() {
        const booleanValidator = Validator.booleanValidator;
        expect(booleanValidator(false)).to.be(true);
        expect(booleanValidator(true)).to.be(true);
        expect(booleanValidator(1)).to.be(false);
        expect(booleanValidator(0)).to.be(false);
        expect(booleanValidator('1')).to.be(false);
        expect(booleanValidator('0')).to.be(false);
    });
    it('arrayValidator', function() {
        const arrayValidator = Validator.arrayValidator;
        expect(arrayValidator([])).to.be(true);
        expect(arrayValidator({})).to.be(false);
        expect(arrayValidator(1)).to.be(false);
    });
    it('URLValidator', function() {
        const URLValidator = Validator.URLValidator;
        expect(URLValidator('http://google.com')).to.be(true);
        expect(URLValidator('googlecom')).to.be(false);
        expect(URLValidator('http://go.c')).to.be(false);
        expect(URLValidator('https://go.cc')).to.be(true);
    });
});