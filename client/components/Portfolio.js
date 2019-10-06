import React, { useState, useEffect } from 'react';
import './Portfolio.scss';

const Stocks = (props) => {
    const [TickerName, setTickerName] = useState('');
    const [Quantity, setQuantity] = useState(0);
    const [StockInfo, setStockInfo] = useState([])
    const [ErrorMsg, SetErrorMsg] = useState('');

    useEffect(() => {
        const evtSource = new EventSource('/api/portfolio');
        evtSource.addEventListener('message', (e) => {
            setStockInfo(JSON.parse(e.data));
        });
        return () => evtSource.close();
    }, []);

    const StockCard = (stock) => {
        return (
            <div className="stock-card" key={stock.symbol}>
                <div>   
                    <h3>{stock.company_name}</h3>
                </div>
                <div className="info">
                    <p>{stock.symbol}</p>
                    <p>-</p>
                    <p> shares</p>
                    <p>&#x40; $ {stock.current_price} per</p>
                </div>
            </div>
        );
    };
    
    return (
        <div className="stock">
            <div>
                { StockInfo.map(val => StockCard(val)) }
            </div>
            <div className="purchase-form">
                <h2>Total Cash: $5000</h2>
                <p style={{color: 'red'}}>{ErrorMsg}</p>
                <input placeholder="Ticker" onChange={(e) => setTickerName(e.target.value)} />
                <input type="number" placeholder="Quantity" onChange={(e) => setQuantity(Number(e.target.value))} />
                <button>Purchase</button>
            </div>
        </div>
    );
};

export default Stocks;