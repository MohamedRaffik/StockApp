const fetch = require('node-fetch');
const API_KEY = process.env.API_KEY;

module.exports = {
    validateEmail : (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    isAuthenticated: (req, res, next) => {
        if (!req.user) return res.status(401).json({error: 'Unauthorized'});
        next();
    },
    getStockInfo: (stock_symbol) => new Promise((resolve, reject) => {
        fetch(`https://cloud.iexapis.com/stable/stock/${stock_symbol}/quote?token=${API_KEY}`)
            .then(response => {
                if (response.status === 404) reject('Invalid Symbol'); 
                return response.json();
            })
            .then(json => resolve(json))
            .catch((err) => {
                console.error(err);
                reject('Failed to get Stock Info')
            });
    })
};