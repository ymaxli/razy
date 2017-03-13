/**
 * @fileOverview validator utils
 * @author Max
 **/

import isMobilePhone = require('validator/lib/isMobilePhone');
import isInt = require('validator/lib/isInt');
import isFloat = require('validator/lib/isFloat');
import isURL = require('validator/lib/isURL');

/**
 * only for basic types
 */
export const notEmptyValidator = (value: any) => value !== '' &&
                                          value !== undefined &&
                                          value !== null &&
                                          !(isNaN(value) && typeof value === 'number') &&
                                          !(Array.prototype.isPrototypeOf(value) && value.length === 0) &&
                                          !(typeof value === 'object' && isEmptyObj(value));
export const phoneValidator = (value: any) => isMobilePhone(value + '', 'zh-CN');
export const integerValidator = (value: any) => typeof value === 'number' && isInt(value + '');
export const floatValidator = (value: any) => typeof value === 'number' && isFloat(value + '');
export const booleanValidator = (value: any) => typeof value === 'boolean';
export const arrayValidator = (value: any) => Array.prototype.isPrototypeOf(value);
export {isURL as URLValidator};

function isEmptyObj(obj: any) {
    for(let i in obj) {
        return false;
    }
    return true;
}

