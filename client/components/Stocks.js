import React, { useState } from 'react';
import PrivateComponent from './PrivateComponent';
import './Stock.scss';

const Stocks = (props) => {
    const [TickerName, setTickerName] = useState('');
    const [Quantity, setQuantity] = useState(0);
    const [ErrorMsg, SetErrorMsg] = useState('');

    const { isLoggedIn, StockInfo, CurrentCash, PurchaseAction } = props;

    const StockCard = (stock) => {
        let color = stock.current_price > stock.open_price ? 'green' : 'red';
        if (stock.current_price === stock.open_price) color = 'grey';
        const shares_available = (CurrentCash / stock.current_price).toFixed(0);

        return (
            <div className="stock-card" key={stock.symbol}>
                <div>   
                    <h3>{stock.company_name}</h3>
                </div>
                <div className="info">
                    <p>{stock.symbol}</p>
                    <p>-</p>
                    <p>{shares_available} shares</p>
                    <p style={{color}}>$ {stock.current_price}</p>
                </div>
            </div>
        );
    };

    const PurchaseForm = () => {
        return (
            <div className="purchase-form">
                <h2>Total Cash: ${CurrentCash}</h2>
                <p style={{color: 'red'}}>{ErrorMsg}</p>
                <input placeholder="Ticker" onChange={(e) => setTickerName(e.target.value)} />
                <input type="number" placeholder="Quantity" onChange={(e) => setQuantity(Number(e.target.value))} />
                <button onClick={PurchaseAction}>Purchase</button>
            </div>
        );
    };
    
    return (
        <div className="stock">
            <div>
                { StockInfo.map(val => StockCard(val)) }
            </div>
            <div className="purchase-form">
                <PrivateComponent Component={PurchaseForm} isAuthenticated={isLoggedIn} Message={'purchase stocks'} />
            </div>
        </div>
    );
};

export default Stocks;