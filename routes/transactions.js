const Router = require('express').Router();

module.exports = (context) => {
    const { transactions } = require('../controllers')(context);
    
    Router.get('/', transactions.list);
    Router.post('/add', transactions.add);
    return Router;
}