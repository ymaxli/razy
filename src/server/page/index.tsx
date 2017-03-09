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
import { getDeviceVars } from '../utils/device-detect';
import { exportConfigToGlobalConst } from './utils';
import { INITIAL_DATA_NAMESPACE } from '../../const';
import {notEmptyValidator} from '../../utils/validator';

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
            let htmlManager = new HTMLManager();

            setUpPage(renderProps, htmlManager);

            let store = generateStore(req.cookies[INITIAL_DATA_NAMESPACE]);

            let asyncTasks: Promise<any>[] = [];
            asyncTasks.concat(loadInitialDataActions(renderProps, store))

            render(req, res, next, htmlManager, store, asyncTasks, renderProps)
                .then(html => {
                    res.setHeader('Content-Type', 'text/html');
                    res.send(html);
                    res.end();

                    timeoutFlag = false;
                    clearTimeout(timeoutIndex);
                }).catch(err => {
                    next(err);

                    timeoutFlag = false;
                    clearTimeout(timeoutIndex);
                });
        }
    });
});

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

function setUpPage(renderProps: any, htmlManager: HTMLManager) {
    renderProps.components.map((item: { WrappedComponent: any }) => {
        if (item && item.WrappedComponent) {
            let component = new item.WrappedComponent();
            // setUpPage
            component.setUpPage(htmlManager);
        }
    });
}

function loadInitialDataActions(renderProps: any, store: Store<any>) {
    let initialDataActions: any[] = [];

    renderProps.components.map((item: { WrappedComponent: any }) => {
        if (item && item.WrappedComponent) {
            let component = new item.WrappedComponent();
            // getInitDataAction
            let action = component.getInitDataAction(renderProps, true);
            notEmptyValidator(action) && initialDataActions.push(action);
        }
    });

    return initialDataActions.map(item => store.dispatch(item));
}

function generateClientGlobalVar(userAgent: string, storeState: any) {
    let thisGlobalVars: any = cloneDeep(configJS);
    const deviceVars = getDeviceVars(userAgent);
    Object.assign(thisGlobalVars, deviceVars);
    thisGlobalVars.__INITIAL_STATE__ = encodeURIComponent(JSON.stringify(storeState));
    return thisGlobalVars;
}

async function render(
    req: _expressStatic.Request,
    res: _expressStatic.Response,
    next: _expressStatic.NextFunction,
    htmlManager: HTMLManager,
    store: any,
    asyncTasks: Promise<any>[],
    renderProps: any) {
    await Promise.all(asyncTasks);

    htmlManager.injectGlobalVar(generateClientGlobalVar(req.headers['user-agent'], store.getState()));

    let html: string;
    html = ReactDOMServer.renderToString(
        <Provider store={store}>
            <RouterContext {...renderProps} />
        </Provider>
    );

    html = htmlManager.getHead() + (html || '') + htmlManager.getFoot();

    return html;
}

export default router;