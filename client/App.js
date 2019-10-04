import React, { useState } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { Stocks, Auth } from './components';
import './App.scss';
const evtSource = new EventSource('/api/stocks');

const App = () => {
    const [Username, setUsername] = useState('');
    const [CurrentCash, setCurrentCash] = useState(5000);
    const [StockInfo, setStockInfo] = useState([]);

    evtSource.addEventListener('message', (e) => {
        setStockInfo(JSON.parse(e.data));
    });
    
    const Purchase = (stock_symbol, amount) => {
        //send network request to buy
    }

    const StocksProps = {
        isLoggedIn: Username ? true : false,
        StockInfo,
        CurrentCash,
        PurchaseAction: Purchase
    };

    const AuthProps = {
        isLoggedIn: Username ? true : false,
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
                        <a>Logout</a>
                    </div> 
                    : 
                    <Link to='/auth'>Login / Register</Link> 
                }
            </nav>
            <Switch>
                {/* <Route path="/" exact render={() => <Stocks {...StocksProps} />} /> */}
                <Route path="/" exact render={() => <Auth {...AuthProps} />} />
            </Switch>   
        </div>
    );
};

export default App;