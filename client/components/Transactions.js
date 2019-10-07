import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Transactions.scss';

const Transactions = (props) => {
    const[UserTransactions, setUserTransactions] = useState([]);

    useEffect(() => {
        fetch('/api/transactions')
            .then(response => response.json())
            .then(json => setUserTransactions(json.transactions))
            .catch(err => console.error(err));
    }, []);

    const transactions = UserTransactions.map(val => {
        const color = val.type === 'purchase' ? 'red' : 'green';
        return (
            <div className="transaction-card" key={val.symbol}>
                <div className="info">
                    <p>{val.symbol}</p>
                    <p>{val.shares} shares @ $ 
                        <span style={{display: 'inline', color}}>{val.price}</span>
                    </p>
                </div>
            </div>
        );
    })

    return ( 
        <div className="transactions">
            <h2>Transactions</h2>
            { transactions }
        </div>
    );
};

export default Transactions;