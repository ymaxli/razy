/**
 * @fileOverview utils.promise-extension test suite
 * @author Max
 **/

declare const describe: any;
declare const before: any;
declare const it: any;

const assert = require('assert');
import start from './test-server';
import { httpGet, httpPost } from './utils/request'

const PATH = 'localhost:9998';
describe('page-render', function () {
    before(function () {
        start();
    });
    it('initialDataAction and setUpPage', function () {
        return httpGet(`${PATH}`, true)
            .then((data: string) => {
                assert(data.indexOf('<title>test123test1234</title>') !== -1)
            });
    });
    it('inject client global initedFlag', function () {
        return httpGet(`${PATH}`, true)
            .then((data: string) => {
                assert(data.indexOf('var __INITED_FLAG__ = \'%7B%22Root%22%3Atrue%7D\'') !== -1);
            });
    });
    it('interceptor', function () {
        return httpGet(`${PATH}/test1`, true)
            .then((data: string) => {
                assert(data === 'Found. Redirecting to /')
            });
    });
    it('env-detect // __NODE_ENV__ injected by test commands', function () {
        return httpGet(`${PATH}`, true)
            .then((data: string) => {
                assert(data.indexOf('var __NODE_ENV__ = \'dev\'') !== -1);
            });
    });
});