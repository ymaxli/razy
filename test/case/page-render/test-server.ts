/**
 * @fileOverview test server
 * @author Max
 */

import { start as startServer } from '../../../dist/index';
import APP from './app';
import ROUTES from './routes';
import { compose, createStore, applyMiddleware } from 'redux';
import promiseMiddleware = require('redux-promise');
import { success, error } from '../../../dist/server/utils/json-result';

const finalCreateStore = compose(
    applyMiddleware(promiseMiddleware)
)(createStore);

export default function () {
    startServer({
        reducerRoot: APP,
        routes: ROUTES,
        createStore: finalCreateStore,
        serverInterceptor: app => {
            app.get('/test/get/1', function (req, res, next) {
                res.json(success({ test: 1 }));
            });
            app.get('/test/get/2', function (req, res, next) {
                res.json(error('error'));
            });
            app.get('/test/get/3', function (req, res, next) {
                res.end('test');
            });
            app.post('/test/post/1', function (req, res, next) {
                res.json(success({ test: parseInt(req.body.test) }));
            });
            app.post('/test/post/2', function (req, res, next) {
                res.json(error(`test ${req.body.test}`));
            });
            app.post('/test/post/3', function (req, res, next) {
                res.end(`test ${req.body.test}`);
            });
        }
    });
}
