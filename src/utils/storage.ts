/**
 * @fileOverview cookie-based storage depending on js-cookie,
 *               support store json object directly
 * @author Max
 **/

import Cookies = require('js-cookie');
import { INITIAL_DATA_NAMESPACE } from '../const';

export default {
    ['$set'](key: string, obj: any) {
        let initialDataObj = Cookies.getJSON(INITIAL_DATA_NAMESPACE) || {};

        initialDataObj[key] = obj;

        Cookies.set(INITIAL_DATA_NAMESPACE, JSON.stringify(initialDataObj), { expires: 7, path: '/' });
    },
    ['$get'](key: string) {
        let initialDataObj = Cookies.getJSON(INITIAL_DATA_NAMESPACE) || {};

        return initialDataObj[key];
    },
    ['$remove'](key: string) {
        let initialDataObj = Cookies.getJSON(INITIAL_DATA_NAMESPACE) || {};
        delete initialDataObj[key];

        Cookies.set(INITIAL_DATA_NAMESPACE, JSON.stringify(initialDataObj), { expires: 7, path: '/' });
    },
    ['set'](key: string, obj: any) {
        Cookies.set(key, obj, { expires: 7, path: '/' });
    },
    ['get'](key: string) {
        return Cookies.get(key);
    },
    ['getJSON'](key: string) {
        return Cookies.getJSON(key);
    },
    ['remove'](key: string) {
        Cookies.remove(key, { path: '/' });
    }
};
