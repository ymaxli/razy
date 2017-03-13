/**
 * @fileOverview extend Promise
 * @author
 */

export function extend() {
    Promise.prototype.finally = function (callback) {
        let P = this.constructor;
        return this.then(
            (value: any) => P.resolve(callback()).then(() => value),
            (reason: any) => P.resolve(callback()).then(() => { throw reason })
        );
    };
}
