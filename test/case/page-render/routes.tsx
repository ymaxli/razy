
/**
 * @fileOverview page routes
 * @author Max
 **/

import * as React from 'react';
import { Route, IndexRoute, Redirect, IndexRedirect } from 'react-router';
import Root = require('./components/root');
import Test1 = require('./components/test1');

const Routes = (
    <Route path="/" component={Root}>
        <Route path="test1" component={Test1}></Route>
    </Route>
);

export default Routes;
