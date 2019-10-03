import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Stocks } from './components';
import './App.scss';

const App = () => {
    const [Username, setUsername] = useState('');
    const [CurrentCash, setCurrentCash] = useState(5000);
    const [StockInfo, setStockInfo] = useState([]);
    
    const fetchStockInfo = () => {
        axios.get('/api/stocks')
            .then(response => setStockInfo(response.data.data))
            .catch(err => console.error(err))
    };

    const Purchase = (stock_symbol, amount) => {
        //send network request to buy
    }

    useEffect(() => {
        fetchStockInfo();
        const stockInterval = setInterval(() => fetchStockInfo(), 3000);
        return () => clearInterval(stockInterval);
    }, [])

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