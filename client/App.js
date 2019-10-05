import React, { useState, useEffect } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { Stocks, Auth, PrivateRoute } from './components';
import './App.scss';

const App = () => {
    const [Username, setUsername] = useState('');
    const [CurrentCash, setCurrentCash] = useState(5000);
    const [StockInfo, setStockInfo] = useState([]);
    
    const Purchase = (stock_symbol, amount, callback) => {
        //send network request to buy
    }

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
                window.location = '/';
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

    useEffect(() => {
        const evtSource = new EventSource('/api/stocks');
        evtSource.addEventListener('message', (e) => {
            setStockInfo(JSON.parse(e.data));
        });
        return () => evtSource.close();
    }, []);

    const StocksProps = {
        isLoggedIn: Username ? true : false,
        StockInfo,
        CurrentCash,
        PurchaseAction: Purchase
    };

    const AuthProps = {
        isLoggedIn: Username ? true : false,
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
                    <Link to='/auth'>Login / Register</Link> 
                }
            </nav>
            <Switch>
                <Route path="/" exact render={() => <Stocks {...StocksProps} />} />
                <PrivateRoute path="/auth" isAuthenticated={Username} Component={Auth} childProps={AuthProps} />
            </Switch>   
        </div>
    );
};

export default App;