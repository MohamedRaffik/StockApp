const Router = require('express').Router();

module.exports = (context) => {
    const { transactions } = require('../controllers')(context);
    
    Router.get('/', transactions.list);
    Router.post('/purchase', transactions.purchase);
    Router.post('/sell', transactions.sell);
    return Router;
}