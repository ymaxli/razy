/**
 * @fileOverview environment detect
 * isomorphic module
 * @author Max
 */
let NODE_ENV = getNodeEnv();
export const modifyNodeEnvOnlyInTests = (dep: any) => {
    NODE_ENV = getNodeEnv(dep);
}
function getNodeEnv(dep?: any) {
    let w = dep || global.window;
    return (typeof w === 'undefined') ? process.env.NODE_ENV : __NODE_ENV__;
}

export const dev = () => NODE_ENV === 'dev';
export const notDev = () => NODE_ENV !== 'dev';
export const prod = () => NODE_ENV === 'production';
export const notProd = () => NODE_ENV !== 'production';
export const test = () => NODE_ENV === 'test';
export const notTest = () => NODE_ENV !== 'test';