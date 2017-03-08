/**
 * @fileOverview device detect
 * @author Max
 */

import MobileDetect = require('mobile-detect');

export function getDeviceVars(userAgent: string) {
    const md = new MobileDetect(userAgent);
    
    return {
        __PHONE__: md.phone() !== null,
        __TABLET__: md.tablet() !== null,
        __MOBILE__: md.mobile() !== null,
        __OS__: md.os()
    };
};