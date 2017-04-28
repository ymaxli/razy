/**
 * @fileOverview utils.iso-request test suite, only server side test
 * @author Max
 **/

const assert = require('assert');
const getRequestMethod = require('../../dist/utils/iso-request').default;
const startMockServer = require('../../dist-test/case/page-render/test-server').default;

let http;
describe('utils.iso-request', function () {
    before(function () {
        startMockServer();
        http = getRequestMethod().http;
    });
    it('get success', function () {
        return http.get('/test/get/1').then(function (data) {
            assert(data.test === 1);
        }, function (err) {
            assert(false, err);
        });
    });
    it('get error', function () {
        return http.get('/test/get/2').then(function (data) {
            assert(false);
        }, function (err) {
            assert(err.msg === 'error');
        });
    });
    it('get raw', function () {
        return http.get('/test/get/3', true).then(function (data) {
            assert(data === 'test');
        }, function (err) {
            assert(false, err);
        });
    });
    it('post success', function () {
        return http.post('/test/post/1', { test: 1 }).then(function (data) {
            assert(data.test === 1);
        }, function (err) {
            assert(false, err);
        });
    });
    it('post error', function () {
        return http.post('/test/post/2', { test: 1 }).then(function (data) {
            assert(false);
        }, function (err) {
            assert(err.msg === `test 1`);
        });
    });
    it('post raw', function () {
        return http.post('/test/post/3', { test: 2 }, {}, true).then(function (data) {
            assert(data === 'test 2');
        }, function (err) {
            assert(false, err);
        });
    });
    it('post custom options', function () {
        return http.post('/test/post/1', {}, { form: undefined, json: { test: 2 } }).then(function (data) {
            assert(data.test === 2);
        }, function (err) {
            assert(false, err);
        });
    });
});