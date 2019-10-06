import React, { useState, useEffect } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { Portfolio, Auth } from './components';
import './App.scss';

const App = () => {
    const [Username, setUsername] = useState('');

    const AuthIn = (info, register, callback) => {
        fetch(`/api/auth/${register ? 'register': 'login'}`, {
            method: 'POST',
            body: JSON.stringify(info),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(json => {
                if (json.error) return callback(json.error);
                setUsername(json.username);
            })
            .catch(err => {
                console.error(err);
                callback('Unable to login');
            });
    };

    useEffect(() => {
        fetch('/api/auth/login', { method: 'POST' })
            .then(response => response.json())
            .then(json => {
                if (json.username) setUsername(json.username);
            })
            .catch(err => console.error(err));
    }, []);

    const AuthProps = {
        AuthIn
    };

    return (
        <div>
            <nav>
                <Link to="/" className="title">Stock App</Link>
                <a>Portfolio</a>
                <a>Transactions</a>
                { Username ? 
                    <div>
                        <a>{Username}</a>
                        <a style={{cursor: 'pointer'}}>Logout</a>
                    </div> 
                    : 
                    null
                }
            </nav>
            <Switch>
                <Route path="/" exact render={() => Username ? <Portfolio /> : <Auth {...AuthProps} />} />
            </Switch>   
        </div>
    );
};

export default App;