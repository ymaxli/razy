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
            execInterceptors(renderProps, req, res, next)
                .then(() => {
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
                        }).catch(err => {
                            next(err);
                        });
                })
                .catch((err: Error) => {
                    if(err.message === 'redirected') {
                        res.end();
                    } else next(err);
                }).finally(() => {
                    timeoutFlag = false;
                    clearTimeout(timeoutIndex);
                });
        }
    });
});

async function execInterceptors(renderProps: any, req: _expressStatic.Request, res: _expressStatic.Response, next: _expressStatic.NextFunction): Promise<any> {
    let interceptors: Promise<any>[] = [];

    for(let item of renderProps.components) {
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

function setUpPage(renderProps: any, htmlManager: HTMLManager) {
    renderProps.components.forEach((item: { WrappedComponent: any }) => {
        if (item && item.WrappedComponent) {
            let component = new item.WrappedComponent();
            // setUpPage
            component.setUpPage(htmlManager);
        }
    });
}

function loadInitialDataActions(renderProps: any, store: Store<any>): Promise<any>[] {
    let initialDataActions: any[] = [];

    renderProps.components.forEach((item: { WrappedComponent: any }) => {
        if (item && item.WrappedComponent) {
            let component = new item.WrappedComponent();
            // getInitDataAction
            let actions = component.getInitDataAction(renderProps, true);
            notEmptyValidator(actions) && initialDataActions.concat(actions);
        }
    });

    return initialDataActions.map(item => store.dispatch(item));
}

function generateClientGlobalVar(deviceVars: DeviceVars, storeState: any) {
    let thisGlobalVars: any = cloneDeep(configJS);
    Object.assign(thisGlobalVars, deviceVars);
    thisGlobalVars.__INITIAL_STATE__ = encodeURIComponent(JSON.stringify(storeState));
    return thisGlobalVars;
}

function getCreateElement(deviceVars: DeviceVars) {
    return (Component: any, props: any) => {
        let newProps = props;
        Object.assign(newProps, deviceVars);
        return React.createElement(Component, newProps);
    };
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

    const deviceVars = getDeviceVars(req.headers['user-agent']);

    htmlManager.injectGlobalVar(generateClientGlobalVar(deviceVars, store.getState()));

    let html: string;
    html = ReactDOMServer.renderToString(
        <Provider store={store}>
            <RouterContext {...renderProps} createElement={getCreateElement(deviceVars)} />
        </Provider>
    );

    html = htmlManager.getHead() + (html || '') + htmlManager.getFoot();

    return html;
}

export default router;