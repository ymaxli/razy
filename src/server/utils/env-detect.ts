/**
 * @fileOverview environment detect
 * @author Max
 */

export const dev = () => !(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test');
export const notDev = () => process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test';
export const prod = () => process.env.NODE_ENV === 'production';
export const test = () => process.env.NODE_ENV === 'test';