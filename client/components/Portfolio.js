import React, { useState, useEffect } from 'react';
import './Portfolio.scss';

const Portfolio = (props) => {

    const [TickerName, setTickerName] = useState('');
    const [Quantity, setQuantity] = useState('');
    const [UserInfo, setUserInfo] = useState({ 
        PortfolioValue: 0, 
        CurrentCash: 0, 
        StockInfo: [] 
    });
    const [ErrorMsg, setErrorMsg] = useState('');
    const [GettingProfileData, setGettingProfileData] = useState(true);

    const Purchase = () => {
        setErrorMsg('Transaction Pending');
        fetch('/api/transactions/purchase', { 
            method: 'POST',
            body: JSON.stringify({ symbol: TickerName.toUpperCase(), shares: Quantity }),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => response.json())
        .then(json => {
            if (json.error) return setErrorMsg(json.error);
            setErrorMsg('');
            GetProfileData();
        }).catch(err => setErrorMsg('Transaction Failed'))
    };

    const Sell = () => {
        setErrorMsg('Transaction Pending');
        fetch('/api/transactions/sell', {
            method: 'POST',
            body: JSON.stringify({ symbol: TickerName.toUpperCase(), shares: Quantity }),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => response.json())
        .then(json => {
            if (json.error) return setErrorMsg(json.error);
            setErrorMsg('');
            GetProfileData();
        }).catch(err => setErrorMsg('Transaction Failed'));
    };

    const GetProfileData = () => {
        if (document.evtSource) document.evtSource.close();
        document.evtSource = new EventSource('/api/portfolio');
        document.evtSource.addEventListener('message', e => {
            const { stocks, cash } = JSON.parse(e.data);
            setUserInfo({...UserInfo, StockInfo: stocks, CurrentCash: Number(cash).toFixed(2) });
            setGettingProfileData(false);
        });
        document.evtSource.addEventListener('error', e => setErrorMsg('Connection to receive Portfolio data was terminated, reload page'));
    };

    useEffect(() => { 
        GetProfileData();
        return () => document.evtSource.close();
    }, []);

    useEffect(() => {
        const value = UserInfo.StockInfo.reduce((prev, curr) => prev + ( curr.current_price * curr.shares ), 0);
        setUserInfo({...UserInfo, PortfolioValue: Number(value).toFixed(2) });
    }, [UserInfo.StockInfo]);

    const StockCard = (stock) => {
        let color = stock.current_price > stock.open_price ? 'green' : 'red';
        if (stock.current_price === stock.open_price || stock.open_price === null) color = 'grey'; 

        return (
            <div className="stock-card" key={stock.symbol}>
                <div>   
                    <h3>{stock.company_name}</h3>
                </div>
                <div className="info">
                    <p>{stock.symbol}</p>
                    <p>-</p>
                    <p>{stock.shares} shares</p>
                    <p style={{color}}>$ {Number(stock.current_price * stock.shares).toFixed(2)}</p>
                </div>
            </div>
        );
    };
    
    return (
        GettingProfileData ?
            <div style={{margin: '2em', textAlign: 'center'}}>Retrieving Profile data ...</div>
            :
            <div>
                <h2 style={{margin: '2em', left: '30%'}}>Portfolio ($ {Number(UserInfo.PortfolioValue).toFixed(2)})</h2>
                <div className="stock">
                    <div>
                        { UserInfo.StockInfo.length !== 0 ? UserInfo.StockInfo.map(val => StockCard(val)) : <p>Purchase stocks to add to your portfolio</p> }
                    </div>
                    <div style={{margin: '10px', width: '2px', height: '300px', backgroundColor: 'black'}}></div>
                    <div className="purchase-form">
                        <h2>Total Cash: ${UserInfo.CurrentCash}</h2>
                        <p style={{color: 'red'}}>{ErrorMsg}</p>
                        <input placeholder="Ticker Name" onChange={(e) => setTickerName(e.target.value)} value={TickerName}/>
                        <input placeholder="Quantity" onChange={(e) => setQuantity(Number(e.target.value))} value={Quantity} />
                        <div className="button">
                            <button onClick={Purchase}>Purchase</button>
                            <button onClick={Sell}>Sell</button>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default Portfolio;