/**
 * @fileOverview json result obj constructor
 * @author Max
 */

export interface errorConstructorInterface {
    (msg: string, code?:number): any
}
export interface successConstructorInterface {
    (data: any, code?:number): any
}
let errorConstructor: errorConstructorInterface, successConstructor: successConstructorInterface;
export function init(options: {
    error?: errorConstructorInterface,
    success?: successConstructorInterface
} = {}) {
    errorConstructor = options.error;
    successConstructor = options.success;
}

export function error(msg: string, code = 1) {
    if(errorConstructor) {
        return errorConstructor(msg, code);
    } else {
        return {
            code,
            msg
        };
    }
};
export function success(data: any, code = 0) {
    if(successConstructor) {
        return successConstructor(data, code);
    } else {
        return {
            code,
            data
        };
    }
};