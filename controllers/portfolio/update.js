 
const setup = (context) => {

    const { utils, User } = context;
    const { isAuthenticated, getStockInfo } = utils;

    const setEventStreamHeader = (req, res, next) => {
        res.status(200).set({
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
        });
        next();
    };

    const sendStockInfo = (req, res, next) => {

        const close = { bool: false };
        
        const sendResponse = (req, res) => {
                const stocks = Object.keys(req.user.portfolio);
                const getInfo = () => {
                    if (close.bool) return res.end();
                    Promise.all(stocks.map((val) => getStockInfo(val)))
                        .then(values => {
                            const StockInfo = values.map(val => {
                                return {
                                    symbol: val['symbol'],
                                    shares: req.user.portfolio[val['symbol']],
                                    company_name: val['companyName'],
                                    open_price: val['previousClose'], 
                                    current_price: Number(val['latestPrice']),
                                };
                            });
                            const data = { stocks: StockInfo, cash: req.user.cash };
                            res.write(`data: ${JSON.stringify(data)}\n\n`);
                            if (!close.bool) setTimeout(getInfo, 5000);
                        })
                        .catch(reason => {});
                    };
            getInfo();
        };

        req.on('close', () => { close.bool = true; });

        sendResponse(req, res);
    };

    return [
        isAuthenticated,
        setEventStreamHeader,
        sendStockInfo
    ];
};

module.exports = setup;