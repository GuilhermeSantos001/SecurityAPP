import React from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { AuthRoute } from './authRoute';

import Auth from '../components/Auth';
import Index from '../components/Index';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Auth} />
            <AuthRoute exact path="/app" component={Index} />
        </Switch>
    </BrowserRouter>
);

export default Routes;