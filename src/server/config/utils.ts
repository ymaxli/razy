/**
 * @fileOverview utils
 * @author Max
 */

export function injectConfVariable(conf: any, prefix?: string) {
    let processedPrefix = prefix ? prefix + '_' : '';
    for(let i in conf) {
        let key = i.charAt(0) === '@' ? i.substr(1) : i; // remove the starting '@' from keys
        if(typeof conf[i] === 'object') {
            injectConfVariable(conf[i], `${processedPrefix}${key}`);
        } else {
            global[`__${processedPrefix}${key}__`] = conf[i];
        }
    }
}