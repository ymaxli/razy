/**
 * @fileOverview device detect
 * @author Max
 */

import MobileDetect = require('mobile-detect');
export interface DeviceVars {
    device_phone: boolean,
    device_tablet: boolean,
    device_mobile: boolean,
    device_os: string
};

export function getDeviceVars(userAgent: string): DeviceVars {
    const md = new MobileDetect(userAgent);
    
    return {
        device_phone: md.phone() !== null,
        device_tablet: md.tablet() !== null,
        device_mobile: md.mobile() !== null,
        device_os: md.os()
    };
};