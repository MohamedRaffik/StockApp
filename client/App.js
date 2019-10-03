import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Stocks } from './components';
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

    return (
        <div>
            <nav>
                <a className="title">Stock App</a>
                <a>Portfolio</a>
                <a>Transactions</a>
                { Username ? <a>{Username}</a> : <a>Sign in / Register</a> }
            </nav>
            <Stocks StockInfo={StockInfo} CurrentCash={CurrentCash} PurchaseAction={Purchase}/>
        </div>
    )
};

export default App;