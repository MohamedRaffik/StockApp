const fetch = require('node-fetch');
const API_KEY = process.env.API_KEY;

const setup = (req, res, next) => {

    const getStockInfo = (stock_symbol) => new Promise((resolve, reject) => {
        fetch(`https://cloud.iexapis.com/stable/stock/${stock_symbol}/quote?token=${API_KEY}`)
            .then(response => response.json())
            .then(json => resolve(json))
            .catch(() => reject('Failed to get Stock Info'));
    });

    const setEventStreamHeader = (req, res) => {
        res.status(200).set({
            'connection': 'keep-alive',
            'cache-control': 'no-cache',
            'content-type': 'text/event-stream'
        });
    };

    const setStocks = (req, res) => {
        req.stocks = [ 'FDS', 'GOOG', 'MSFT', 'AAPL', 'UBER' ];
    };
    
    const sendResponse = (req, res) => {
        const getInfo = () => Promise.all(req.stocks.map((val) => getStockInfo(val)))
            .then(values => {
                const StockInfo = values.map(val => {
                    return {
                        symbol: val['symbol'],
                        company_name: val['companyName'],
                        primary_exchange: val['primaryExchange'],
                        open_price: Number(val['open']).toFixed(2), 
                        current_price: Number(val['latestPrice']).toFixed(2),
                    }
                });
                res.write(`data: ${JSON.stringify(StockInfo)}\n\n`);
                setTimeout(getInfo, 5000);
            })
            .catch(reason => { console.error(reason); });
        getInfo();
    };

    setEventStreamHeader(req, res);
    setStocks(req, res);
    sendResponse(req, res);
};

module.exports = setup;