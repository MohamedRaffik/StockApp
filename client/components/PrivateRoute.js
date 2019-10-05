import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = (props) => {
    const { Component, path, childProps, isAuthenticated} = props; 
    return isAuthenticated ?
        <Redirect to="/" />
        :
        <Route to={path} render={() => <Component {...childProps} />} />
};

export default PrivateRoute;