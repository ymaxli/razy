/**
 * @fileOverview utils.promise-extension test suite
 * @author Max
 **/

const assert = require('assert');
const PromiseExtension = require('../../dist/utils/promise-extension');

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