/**
 * @fileOverview test server
 * @author Max
 */

import { start as startServer } from '../../../dist/index';
import APP from './app';
import ROUTES from './routes';
import { compose, createStore, applyMiddleware } from 'redux';
import promiseMiddleware = require('redux-promise');

const finalCreateStore = compose(
    applyMiddleware(promiseMiddleware)
)(createStore);

export default function() {
    startServer({
        reducerRoot: APP,
        routes: ROUTES,
        createStore: finalCreateStore,
        serverInterceptor: app => {

        }
    });
}
