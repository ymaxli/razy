/**
 * @fileOverview render React components
 * @author Max
 */

import * as express from 'express';
import * as _expressStatic from 'express-serve-static-core'; // https://github.com/Microsoft/TypeScript/issues/5938
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { vanillaConfigObj } from '../config';
import { Store } from 'redux';
import cloneDeep = require('lodash.clonedeep');
import * as Immutable from 'immutable';
import HTMLManager from '../bootstrap/html-manager';
import { Provider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import { getDeviceVars, DeviceVars } from '../utils/device-detect';
import { exportConfigToGlobalConst } from './utils';
import { INITIAL_DATA_NAMESPACE } from '../../const';
import { notEmptyValidator } from '../../utils/validator';
import getClassName from '../../utils/get-classname';

const router = express.Router();

const TIMEOUT = 15 * 1000;

let APP: any, routes: any, createStore: any;
export function init(_reducerRoot: any, _routes: any, _createStore: any) {
    APP = _reducerRoot;
    routes = _routes;
    createStore = _createStore;
}

const configJS = exportConfigToGlobalConst(vanillaConfigObj);

router.all('*', function (req, res, next) {
    console.log(`new request ${req.path}`);

    match({
        routes,
        location: req.url
    }, (error, redirectLocation, renderProps) => {
        let timeoutFlag = true;
        let timeoutIndex = setTimeout(function () {
            if (timeoutFlag) {
                next(new Error('request timeout'));
            }
        }, TIMEOUT);

        if (redirectLocation) {
            res.redirect(301, redirectLocation.pathname + redirectLocation.search);
        } else if (error) {
            next(error);
        } else if (renderProps === undefined) {
            res.status(404).send('Not found');
        } else {
            render(req, res, next, renderProps)
                .catch((err: Error) => {
                    if (err.message === 'redirected') {
                        res.end();
                    } else {
                        console.error(err);
                        console.error(err.stack);
                        next(err);
                    }
                }).finally(() => {
                    timeoutFlag = false;
                    clearTimeout(timeoutIndex);
                });
        }
    });
});

async function render(
    req: _expressStatic.Request,
    res: _expressStatic.Response,
    next: _expressStatic.NextFunction,
    renderProps: any) {
    // interceptor
    await execInterceptors(renderProps.components, req, res, next);

    // initial data actions and set up pages
    let htmlManager = new HTMLManager();
    let store = generateStore(req.cookies[INITIAL_DATA_NAMESPACE]);
    let initialDataAndSetUpTasks: Promise<any>[] = [];
    let initedPage: { [key: string]: boolean } = {};
    renderProps.components.forEach((item: { WrappedComponent: any }) => {
        if (item && item.WrappedComponent) {
            let component = new item.WrappedComponent();

            // add data inited flag
            initedPage[getClassName(component)] = true;

            let actions = component.getInitDataAction(renderProps);
            if (notEmptyValidator(actions)) {
                initialDataAndSetUpTasks.push(new Promise((resolve, reject) => {
                    Promise.all(actions.map((item: any) => store.dispatch(item)))
                        .then((datas: any[]) => {
                            component.setUpPage(htmlManager, datas);
                            resolve();
                        }).catch(reject);
                }));
            } else {
                initialDataAndSetUpTasks.push(new Promise((resolve, reject) => {
                    component.setUpPage(htmlManager);
                    resolve();
                }));
            }
        }
    });

    try {
        await Promise.all(initialDataAndSetUpTasks);
    } catch (error) {
        console.log(error);
    }

    // get deviceVars
    const deviceVars = getDeviceVars(req.headers['user-agent']);
    htmlManager.injectGlobalVar(generateClientGlobalVar(deviceVars, store.getState(), initedPage));

    // render
    let html: string;
    html = ReactDOMServer.renderToString(
        <Provider store={store}>
            <RouterContext {...renderProps} createElement={getCreateElement(deviceVars, initedPage)} />
        </Provider>
    );
    html = htmlManager.getHead() + (html || '') + htmlManager.getFoot();

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
    res.end();
}

async function execInterceptors(components: any, req: _expressStatic.Request, res: _expressStatic.Response, next: _expressStatic.NextFunction): Promise<any> {
    let interceptors: Promise<any>[] = [];

    for (let item of components) {
        if (item && item.WrappedComponent) {
            let component = new item.WrappedComponent();
            await component.interceptor(req, res, next);
        }
    }
}

function generateStore(initialDataFromClient: any) {
    let initialStateImmutable: any = {};
    if (initialDataFromClient) {
        const initialData = JSON.parse(initialDataFromClient);
        for (let i in initialData) {
            let item = initialData[i];
            initialStateImmutable[i] = Immutable.fromJS(item);
        }
    }
    return createStore(APP, initialStateImmutable);
}

function generateClientGlobalVar(deviceVars: DeviceVars, storeState: any, initedFlag: { [key: string]: boolean }) {
    let thisGlobalVars: any = cloneDeep(configJS);
    Object.assign(thisGlobalVars, deviceVars);
    thisGlobalVars.__INITIAL_STATE__ = encodeURIComponent(JSON.stringify(storeState));
    thisGlobalVars.__INITED_FLAG__ = encodeURIComponent(JSON.stringify(initedFlag));
    thisGlobalVars.__NODE_ENV__ = process.env.NODE_ENV;
    return thisGlobalVars;
}

function getCreateElement(deviceVars: DeviceVars, initedFlag: { [key: string]: boolean }) {
    return (Component: any, props: any) => {
        let newProps = cloneDeep(props);
        Object.assign(newProps, deviceVars);
        Object.assign(newProps, { initedFlag });
        return React.createElement(Component, newProps);
    };
}

export default router;