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
            device_phone: false,
            device_tablet: false,
            device_mobile: false,
            device_os: null
        });
    });
    it('mobile', function() {
        let result = getDeviceVars('Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Mobile Safari/537.36');

        expect(result).to.eql({
            device_phone: true,
            device_tablet: false,
            device_mobile: true,
            device_os: 'AndroidOS'
        });
    });
    it('tablet', function() {
        let result = getDeviceVars('Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1');

        expect(result).to.eql({
            device_phone: false,
            device_tablet: true,
            device_mobile: true,
            device_os: 'iOS'
        });
    });
});