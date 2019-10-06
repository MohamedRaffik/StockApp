const fetch = require('node-fetch');
const { isAuthenticated } = require('../utils');
const API_KEY = process.env.API_KEY;

const setup = (context) => {
    const { User } = context;

    const listTransactions = (req, res, next) => {
        const user = User(req.user.data);
        const { stock_symbol, shares } = req.body;
        fetch(`https://cloud.iexapis.com/stable/stock/${stock_symbol}/quote?token=${API_KEY}`)
                .then(response => response.json())
                .then(json => {
                    user.addTransaction(json['symbol'], Number(json['latestPrice']).toFixed(2), shares)
                        .then(success => {
                            if (success) return res.json({currentCash: user.data.cash})
                            return res.json({error: 'Unable to complete transactions'})
                        })
                        .catch(err => res.json({error: 'Unable to complete transactions'}));
                })
                .catch((err) => {
                    console.error(err);
                    reject('Failed to get Stock Info')
                });
    }
}