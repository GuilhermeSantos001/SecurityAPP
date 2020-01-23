import React from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { AuthRoute } from './authRoute';

import Index from '../components/Index';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={() => <h1>Hello World</h1>} />
            <AuthRoute exact path="/app" component={() => <Index />} />
        </Switch>
    </BrowserRouter>
);

export default Routes;