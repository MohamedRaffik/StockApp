const setup = (context) => {

    const { utils } = context;
    const { isAuthenticated, getStockInfo } = utils;
        
    const sendResponse = (req, res) => {
        const stocks = Object.keys(req.user.portfolio);
        Promise.all(stocks.map((val) => getStockInfo(val)))
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
                return res.status(200).json({ stocks: StockInfo, cash: req.user.cash });
            })
            .catch(reason => { 
                console.error(reason); 
                return res.status(500).json({ error: reason });
            });
    };

    return [
        isAuthenticated,
        sendResponse
    ];
};

module.exports = setup;