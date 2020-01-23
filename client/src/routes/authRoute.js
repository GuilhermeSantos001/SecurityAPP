import React from 'react';

import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from './js/auth';

export const AuthRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        isAuthenticated() ? (
            <Component {...props} />
        ) : (
                <Redirect to={{ pathname: '/', state: { from: props.location } }} />
            )
    )} />
);