 
const setup = (context) => {

    const { utils, User } = context;
    const { isAuthenticated, getMultipleStockInfo } = utils;

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
                if (stocks.length === 0) {
                    res.write(`data: ${JSON.stringify({ stocks: [], cash: req.user.cash })}\n\n`);
                    if (!close.bool) setTimeout(getInfo, 5000);
                } else {
                    getMultipleStockInfo(stocks)
                        .then(values => {
                            const StockInfo = Object.keys(values).map(symbol => {
                                const symbol_info = values[symbol]['quote'];
                                return {
                                    symbol,
                                    shares: Number(req.user.portfolio[symbol]),
                                    company_name: symbol_info['companyName'],
                                    open_price: Number(symbol_info['previousClose']), 
                                    current_price: Number(symbol_info['latestPrice']),
                                };
                            });
                            const data = { stocks: StockInfo, cash: req.user.cash };
                            res.write(`data: ${JSON.stringify(data)}\n\n`);
                            if (!close.bool) setTimeout(getInfo, 5000);
                        })
                        .catch(reason => { console.log(reason); });
                };
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