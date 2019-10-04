import React from 'react';
import './Auth.scss';

const Auth = (props) => {
    return (
        <div>
            <div>
                <h3>Register</h3>
                <input placeholder="Full Name" />
                <input placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button>Register</button>
            </div>
            <div class="vert-line"></div>
            <div>
                <h3>Login</h3>
                <input placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button>Login</button>
            </div>
        </div>
    );
};

export default Auth;