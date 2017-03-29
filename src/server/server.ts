/**
 * @fileOverview 服务器入口
 * @author Max
 **/

import * as express from 'express';
import './config';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import {ParamsInterface} from '../index'
import * as jr from './utils/json-result';
import {default as Page, init as pageInit} from './page';
import * as env from './utils/env-detect';
import {extend as promiseExtend} from '../utils/promise-extension';
promiseExtend();

import {importFile} from './utils/less-loader';
global._importLess = importFile;

import getRequestMethod from '../utils/iso-request';


import retina, {ret} from '../utils/retina';
retina(__RETINA_DEFAULT_RATIO__);
global.ret = ret;

const app = express();

export function start(params: ParamsInterface, interceptor?: (app: express.Express) => void) {
    const requestMethods = getRequestMethod(params.dataFlagResolver);
    global._http = requestMethods.http;
    global._https = requestMethods.https;

    jr.init({
        error: params.resultObjErrorConstructor,
        success: params.resultObjSuccessConstructor
    });
    pageInit(params.reducerRoot, params.routes, params.createStore);
    
    app.use(compression());
    app.use(cookieParser());
    app.use(session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true
    }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.all('*', (req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", __CROSSDOMAIN__);
        next();
    });

    // serve static files
    app.use(`/${__DIST_PATH__}`, express.static(__DIST_PATH__));
    app.use(`/${__DIST_PATH__}`, function(req, res, next) {
        res.status(404).end('Static File Not Found'); 
    });

    // stub
    if(env.dev()) {
        const StubMiddleware = require('./stub');
        app.use('/stub', StubMiddleware.router);
    }

    // interceptor
    if(interceptor) interceptor(app);

    // page
    app.use('/', Page);

    app.listen(__PORT__);
    console.log(`listen to ${__PORT__}`);
    console.log(`server start complete`);
}
