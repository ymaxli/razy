/**
 * @fileOverview server.utils.device-detect test suite
 * @author Max
 **/

let expect = require('expect.js');
let DeviceDetect = require('../../dist/server/utils/device-detect');
let getDeviceVars = DeviceDetect.getDeviceVars;

describe('server.utils.device-detect', function() {
    it('desktop', function() {
        let result = getDeviceVars('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36');

        expect(result).to.eql({
            __PHONE__: false,
            __TABLET__: false,
            __MOBILE__: false,
            __OS__: null
        });
    });
    it('mobile', function() {
        let result = getDeviceVars('Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Mobile Safari/537.36');

        expect(result).to.eql({
            __PHONE__: true,
            __TABLET__: false,
            __MOBILE__: true,
            __OS__: 'AndroidOS'
        });
    });
    it('tablet', function() {
        let result = getDeviceVars('Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1');

        expect(result).to.eql({
            __PHONE__: false,
            __TABLET__: true,
            __MOBILE__: true,
            __OS__: 'iOS'
        });
    });
});