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
        return (
            <div className="transaction-card" key={val.symbol}>
                <div className="info">
                    <p>{val.symbol}</p>
                    <p>{val.shares} shares @ $ {val.price}</p>
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