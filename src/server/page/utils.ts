/**
 * @fileOverview utils
 * @author Max
 */

import cloneDeep = require('lodash.clonedeep');

export function exportConfigToGlobalConst(config: any) {
    let result: any = {};
    const read = (key: string[], obj: any) => {
        if(typeof obj === 'object') {
            for(let i in obj) {
                let item = obj[i];
                let newKey = cloneDeep(key);
                newKey.push(i);
                read(newKey, item);
            }
        } else {
            let keyStr = `__${key.join('_')}__`;
            if(keyStr.indexOf('@') !== -1) return; // escape config containing '@'
            result[keyStr] = obj;
        }
    };
    
    read([], config);
    
    return result;
}