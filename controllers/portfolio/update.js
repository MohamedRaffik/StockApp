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
            const stocks = Object.keys(req.user.data.portfolio);
            const getInfo = () => Promise.all(stocks.map((val) => getStockInfo(val)))
                .then(values => {
                    const StockInfo = values.map(val => {
                        return {
                            symbol: val['symbol'],
                            shares: req.user.data.portfolio[val['symbol']],
                            company_name: val['companyName'],
                            open_price: Number(val['open']).toFixed(2), 
                            current_price: Number(val['latestPrice']).toFixed(2),
                        }
                    });
                    const data = { stocks: StockInfo, cash: req.user.data.cash };
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