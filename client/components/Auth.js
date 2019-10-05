import React, { useState } from 'react';
import './Auth.scss';

const Auth = (props) => {
    const [RegisterInfo, setRegisterInfo] = useState({ name: '', email: '', password: '' });
    const [LoginInfo, setLoginInfo] = useState({ email: '', password: '' });
    const [ErrorMsg, setErrorMsg] = useState('');

    const { isLoggedIn, AuthIn } = props;

    const AuthInAction = (register) => {
        setErrorMsg('');
        if (register) AuthIn(RegisterInfo, true, setErrorMsg);
        AuthIn(LoginInfo, false, setErrorMsg);
        setRegisterInfo({ name: '', email: '', password: '' });
        setLoginInfo({ email: '', password: '' })
    }

    return (
        <div>
            <p className="error">{ErrorMsg ? `Error: ${ErrorMsg}` : ''}</p>
            <div className="auth">
                <div className="register">
                    <h3>Register</h3>
                    <div>
                        <p>Name</p>
                        <input onChange={(e) => setRegisterInfo({...RegisterInfo, name: e.target.value})} value={RegisterInfo.name} />
                    </div>
                    <div>
                        <p>Email</p>
                        <input type="email" onChange={(e) => setRegisterInfo({...RegisterInfo, email: e.target.value})} value={RegisterInfo.email} />
                    </div>
                    <div>
                        <p>Password</p>
                        <input type="password" onChange={(e) => setRegisterInfo({...RegisterInfo, password: e.target.value})} value={RegisterInfo.password} />
                    </div>
                    <button onClick={() => AuthInAction(true)}>Register</button>
                </div>
                <div className="vert-line"></div>
                <div className="login">
                    <h3>Login</h3>
                    <div>
                        <p>Email</p>
                        <input type="email" onChange={(e) => setLoginInfo({...LoginInfo, email: e.target.value})} value={LoginInfo.email} />
                    </div>
                    <div>
                        <p>Password</p>
                        <input type="password" onChange={(e) => setLoginInfo({...LoginInfo, password: e.target.value})} value={LoginInfo.password} />
                    </div>
                    <button onClick={() => AuthInAction(false)}>Login</button>
                </div>
            </div>
        </div>
    );
};

export default Auth;