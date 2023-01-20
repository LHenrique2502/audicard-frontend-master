import React, {Component, Suspense} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import {isAuthenticated} from "./Auth";

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuthenticated() ? (
                <Component {...props} />
            ) : (
                <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
            )
        }
    />
);