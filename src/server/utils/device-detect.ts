/**
 * @fileOverview device detect
 * @author Max
 */

import MobileDetect = require('mobile-detect');
export interface DeviceVars {
    __PHONE__: boolean,
    __TABLET__: boolean,
    __MOBILE__: boolean,
    __OS__: string
};

export function getDeviceVars(userAgent: string): DeviceVars {
    const md = new MobileDetect(userAgent);
    
    return {
        __PHONE__: md.phone() !== null,
        __TABLET__: md.tablet() !== null,
        __MOBILE__: md.mobile() !== null,
        __OS__: md.os()
    };
};