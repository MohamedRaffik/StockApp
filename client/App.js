import React, { useState, useEffect } from 'react';
import { Redirect, Route, Link, Switch } from 'react-router-dom';
import { Portfolio, Auth, Transactions } from './components';
import './App.scss';

const UnAuthorizedComponent = (props) => {
    const { name } = props;

    return (
        <div className="unauthorized">
            <h3>
                <Link to="/">Register</Link> or <Link to="/">Login</Link> to view {name}
            </h3>
        </div>
    );
};

const App = () => {
    const [Username, setUsername] = useState('');
    const [CheckingAuth, setCheckingAuth] = useState(true);

    const AuthIn = (info, register, callback) => {
        fetch(`/api/auth/${register ? 'register': 'login'}`, {
            method: 'POST',
            body: JSON.stringify(info),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => response.json())
        .then(json => {
            if (json.error) {
                callback(json.error);
                return;
            }
            setUsername(json.username);
        })
        .catch(err => callback('Unable to login'));
    };

    const Logout = () => {
        setCheckingAuth(true);
        fetch('/api/auth/logout')
            .then(response => {
                setUsername('');
                setCheckingAuth(false)
                window.location = '/';
            }).catch(err => console.error(err));
    }

    useEffect(() => {
        fetch('/api/auth/login', { method: 'POST' })
            .then(response => response.json())
            .then(json => {
                if (json.username) setUsername(json.username);
                setCheckingAuth(false);
            }).catch(err => setCheckingAuth(false));
    }, []);

    const AuthProps = {
        AuthIn
    };

    return (
        <div>
            <nav>
                <Link to={Username ? "/portfolio" : "/"} className="title">Stock App</Link>
                <Link to="/portfolio">Portfolio</Link>
                <Link to="/transactions">Transactions</Link>
                { Username ? 
                    <div>
                        <a>{Username}</a>
                        <a style={{cursor: 'pointer'}} onClick={Logout}>Logout</a>
                    </div> 
                    : 
                    null
                }
            </nav>
            { CheckingAuth ?
                <div style={{textAlign: 'center'}}>Checking if logged in ...</div>
                :
                <Switch>
                    <Route path="/" exact render={() => Username ? <Redirect to="/portfolio" /> : <Auth {...AuthProps} />} />
                    <Route path="/portfolio" exact render={() => Username ? <Portfolio /> : <UnAuthorizedComponent name={'Portfolio'} />} />
                    <Route path="/transactions" exact render={() => Username ? <Transactions /> : <UnAuthorizedComponent name={'Transactions'} />} />
                </Switch>   
            }
        </div>
    );
};

export default App;