/**
 * @fileOverview utils.promise-extension test suite
 * @author Max
 **/

let expect = require('expect.js');
let PromiseExtension = require('../../dist/utils/promise-extension');

describe('utils.action-utils', function () {
    before(function() {
        PromiseExtension.extend();
    });
    it('normal resolve', function (done) {
        let a = new Promise((resolve, reject) => {
            resolve();
        });

        a
        .then(() => {})
        .catch(() => {})
        .finally(() => {
            done();
        });
    });
    it('normal reject', function (done) {
        let a = new Promise((resolve, reject) => {
            reject();
        });

        a
        .then(() => {})
        .catch(() => {})
        .finally(() => {
            done();
        });
    });
});