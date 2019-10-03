const Router = require('express').Router();
const axios = require('axios');
const API_KEY = process.env.API_KEY;

Router.get('/', (req, res, next) => {
    const getStockInfo = (stock_symbol) => 
        new Promise((resolve, reject) => {
            axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stock_symbol}&interval=5min&outputsize=compact&apikey=${API_KEY}`)
                .then(response => resolve(response))
                .catch(() => reject('Failed to get Stock Info'));
    });

    const Stocks = [ 'FDS', 'GOOG', 'MSFT', 'AAPL', 'UBER' ];
    Promise.all(Stocks.map((val) => getStockInfo(val)))
        .then((values) => console.log(values.map((val) => val.data)));

    res.send('got it');
});

module.exports = Router;