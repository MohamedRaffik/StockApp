const axios = require('axios');

const setup = () => {

    const getStockInfo = (stock_symbol) => new Promise((resolve, reject) => {
        axios.get(`https://cloud.iexapis.com/stable/stock/${stock_symbol}/quote?token=${API_KEY}`)
            .then(response => resolve(response.data))
            .catch(() => reject('Failed to get Stock Info'));
    });

    const setEventStreamHeader = (req, res, next) => {
        res.status(200).set({
            'connection': 'keep-alive',
            'cache-control': 'no-cache',
            'content-type': 'text/event-stream'
        });
        next();
    };

    const setStocks = (req, res, next) => {
        req.stocks = [ 'FDS', 'GOOG', 'MSFT', 'AAPL', 'UBER' ];
        next();
    };
    
    const sendResponse = (req, res, next) => {
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

    return [
        setEventStreamHeader,
        setStocks,
        sendResponse
    ];
};

module.exports = setup;