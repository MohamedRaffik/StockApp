import React, { useState, useEffect } from 'react';
import './Transactions.scss';

const Transactions = (props) => {
    const [UserTransactions, setUserTransactions] = useState([]);
    const [GettingTransactionsData, SetGettingTransactionData] = useState(true);

    useEffect(() => {
        fetch('/api/transactions')
            .then(response => response.json())
            .then(json => {
                setUserTransactions(json.transactions);
                SetGettingTransactionData(false);
            })
            .catch(err => console.error(err));
    }, []);

    const transactions = UserTransactions.map((val, i) => {
        const color = val.type === 'purchase' ? 'red' : 'green';
        return (
            <div className="transaction-card" key={val.symbol + i}>
                <div className="info">
                    <p>{val.symbol}</p>
                    <p>{val.shares} shares @ $ 
                        <span style={{display: 'inline', color}}>{Number(val.price).toFixed(2)}</span>
                    </p>
                </div>
            </div>
        );
    })

    return ( 
        GettingTransactionsData ?
            <div style={{margin: '2em', textAlign: 'center'}}>Retrieving Transaction Data ...</div>
            :
            <div className="transactions">
                <h2>Transactions</h2>
                { transactions }
            </div>
    );
};

export default Transactions;