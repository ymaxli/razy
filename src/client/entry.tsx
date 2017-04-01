/**
 * @fileOverview client page entry
 * @author Max
 */

import '../utils/object-assign-polyfill';
import { DataFlagResolver } from '../utils/request';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { match, Router, browserHistory } from 'react-router';
import * as Immutable from 'immutable';
import { default as retinaSetUp, ret } from '../utils/retina';
import { default as getRequestMethod } from '../utils/iso-request';
import { default as Storage } from '../utils/storage';
import { DeviceVars } from '../server/utils/device-detect';
import { extend as promiseExtend } from '../utils/promise-extension';

export interface ParamsInterface {
    devTools: any
    dataFlagResolver?: DataFlagResolver
    routes: any
    APP: any
    createStore: any
}

let routes: any, APP, finalCreateStore, devTools, store: any, createElement: any;
let isSetUp = false;

export function setUp(params: ParamsInterface) {
    routes = params.routes;
    APP = params.APP;
    finalCreateStore = params.createStore;
    devTools = params.devTools;

    const requestMothods = getRequestMethod(params.dataFlagResolver);
    window._http = requestMothods.http;
    window._https = requestMothods.https;

    promiseExtend();
    retinaSetUp();
    window.ret = ret;
    window._storage = Storage;

    let initialState = JSON.parse(decodeURIComponent(__INITIAL_STATE__));
    for (let i in initialState) {
        initialState[i] = Immutable.fromJS(initialState[i]);
    }

    const initedFlag = JSON.parse(decodeURIComponent(__INITED_FLAG__));

    store = finalCreateStore(APP, initialState);

    let customProps: any = {
        devTools
    };
    let deviceVars: DeviceVars = {
        device_mobile,
        device_phone,
        device_tablet,
        device_os
    };
    Object.assign(customProps, deviceVars);
    Object.assign(customProps, { initedFlag });

    createElement = (Component: any, props: any) => {
        let newProps = props;
        Object.assign(newProps, customProps);
        return React.createElement(Component, newProps);
    };

    isSetUp = true;
}

export function render() {
    if (!isSetUp) throw new Error('please call setUp method first!');

    match({ history: browserHistory, routes }, (error, redirectLocation, renderProps) => {
        ReactDOM.render((
            <Provider store={store}>
                <Router createElement={createElement} {...renderProps} history={browserHistory} />
            </Provider>
        ), document.getElementById('root'));
    });
}