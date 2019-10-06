import React, { useState, useEffect } from 'react';
import './Portfolio.scss';

const Portfolio = (props) => {

    const [TickerName, setTickerName] = useState('');
    const [Quantity, setQuantity] = useState('');
    const [PortfolioValue, setPortfolioValue] = useState(0);
    const [CurrentCash, setCurrentCash] = useState(0);
    const [StockInfo, setStockInfo] = useState([])
    const [ErrorMsg, SetErrorMsg] = useState('');

    const Purchase = () => {
        fetch('/api/transactions/add', { 
            method: 'POST',
            body: JSON.stringify({ symbol: TickerName, shares: Quantity }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(json => {
                if (json.error) return SetErrorMsg(json.error);
                document.location.reload();
            })
            .catch(err => SetErrorMsg('Transaction failed'))
    };

    useEffect(() => {
        const evtSource = new EventSource('/api/portfolio');
        evtSource.addEventListener('message', (e) => {
            const { stocks, cash } = JSON.parse(e.data);
            setStockInfo(stocks);
            setCurrentCash(cash);
        });
        return () => evtSource.close();
    }, []);

    useEffect(() => {
        const value = StockInfo.reduce((prev, curr, i) => prev + ( curr.current_price * curr.shares ), 0);
        setPortfolioValue(Number(value).toFixed(2));
    }, [StockInfo]);

    const StockCard = (stock) => {
        let color = stock.current_price > stock.open_price ? 'green' : 'red';
        if (stock.current_price === stock.open_price) color = 'grey'; 

        return (
            <div className="stock-card" key={stock.symbol}>
                <div>   
                    <h3>{stock.company_name}</h3>
                </div>
                <div className="info">
                    <p>{stock.symbol}</p>
                    <p>-</p>
                    <p>{stock.shares} shares</p>
                    <p style={{color}}>$ {stock.current_price * stock.shares}</p>
                </div>
            </div>
        );
    };
    
    return (
        <div>
            <h2 style={{margin: '2em', left: '30%'}}>Portfolio ($ {PortfolioValue})</h2>
            <div className="stock">
                <div>
                    { StockInfo.length !== 0 ? StockInfo.map(val => StockCard(val)) : <p>Purchase stocks to add to your portfolio</p> }
                </div>
                <div style={{margin: '10px', width: '2px', height: '300px', backgroundColor: 'black'}}></div>
                <div className="purchase-form">
                    <h2>Total Cash: ${CurrentCash}</h2>
                    <p style={{color: 'red'}}>{ErrorMsg}</p>
                    <input placeholder="Ticker" onChange={(e) => setTickerName(e.target.value)} value={TickerName}/>
                    <input placeholder="Quantity" onChange={(e) => setQuantity(Number(e.target.value))} value={Quantity} />
                    <button onClick={Purchase}>Purchase</button>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;