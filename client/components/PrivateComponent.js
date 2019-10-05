import React from 'react'
import { Link } from 'react-router-dom';

const PrivateComponent = (props) => {
    const { Component, ComponentProps, isAuthenticated, Message } = props;
    return isAuthenticated ?
        <Component {...ComponentProps} />
        :
        <div>
            <p>
                <Link to="/auth">Login</Link>
                or 
                <Link to="/auth">Register</Link>
                to {Message}
            </p>
        </div>
};

export default PrivateComponent;