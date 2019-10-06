const fetch = require('node-fetch');
const API_KEY = process.env.API_KEY;

const { isAuthenticated, getStockInfo } = require('../utils');

const setup = (context) => {

    const sendStockInfo = (req, res, next) => {

        /**
         * Retrieves stock information for a particular stock name
         * @param {String} stock_symbol 
         * @returns {Promise} Stock Information or error
         */
        

        const setEventStreamHeader = (req, res) => {
            res.status(200).set({
                'connection': 'keep-alive',
                'cache-control': 'no-cache',
                'content-type': 'text/event-stream'
            });
        };
        
        const sendResponse = (req, res) => {
            const stocks = Object.keys(req.user.portfolio);
            const getInfo = () => Promise.all(stocks.map((val) => getStockInfo(val)))
                .then(values => {
                    const StockInfo = values.map(val => {
                        return {
                            symbol: val['symbol'],
                            shares: req.user.portfolio[val['symbol']],
                            company_name: val['companyName'],
                            open_price: Number(val['open']), 
                            current_price: Number(val['latestPrice']),
                        }
                    });
                    const data = { stocks: StockInfo, cash: req.user.cash };
                    res.write(`data: ${JSON.stringify(data)}\n\n`);
                    setTimeout(getInfo, 5000);
                })
                .catch(reason => { console.error(reason); });
            getInfo();
        };

        setEventStreamHeader(req, res);
        sendResponse(req, res);
    };

    return [
        isAuthenticated,
        sendStockInfo
    ];
};

module.exports = setup;