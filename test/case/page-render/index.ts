/**
 * @fileOverview utils.promise-extension test suite
 * @author Max
 **/

declare const describe: any;
declare const before: any;
declare const it: any;

const assert = require('assert');
import start from './test-server';
import {httpGet, httpPost} from './utils/request'

const PATH = 'localhost';
describe('page-render', function () {
    before(function() {
        start();
    });
    it('initialDataAction and setUpPage', function() {
        return httpGet(`${PATH}`, true)
        .then((data: string) => {
            assert(data.indexOf('<title>test123</title>'))
        });
    });
});