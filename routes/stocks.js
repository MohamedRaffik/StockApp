const Router = require('express').Router();
const axios = require('axios');
const API_KEY = process.env.API_KEY;

Router.get('/', (req, res, next) => {
    const getStockInfo = (stock_symbol) => 
        new Promise((resolve, reject) => {
            axios.get(`https://cloud.iexapis.com/stable/stock/${stock_symbol}/quote?token=${API_KEY}`)
                .then(response => resolve(response.data))
                .catch(() => reject('Failed to get Stock Info'));
    });

    const Stocks = [ 'FDS', 'GOOG', 'MSFT', 'AAPL', 'UBER' ];
    Promise.all(Stocks.map((val) => getStockInfo(val)))
        .then(values => {
            const StockInfo = values.map(val => {
                return {
                    symbol: val['symbol'],
                    company_name: val['companyName'],
                    primary_exchange: val['primaryExchange'],
                    open_price: val['open'], 
                    current_price: val['latestPrice'],
                }
            });
            res.json({
                data: StockInfo
            });
        })
        .catch(reason => res.json({'error': reason}));
});

module.exports = Router;