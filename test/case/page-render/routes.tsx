
/**
 * @fileOverview page routes
 * @author Max
 **/

import * as React from 'react';
import { Route, IndexRoute, Redirect, IndexRedirect } from 'react-router';
import Root = require('./components/root');

const Routes = (
    <Route path="/" component={Root}>
        <Route path="test" component={Root}></Route>
    </Route>
);

export default Routes;
