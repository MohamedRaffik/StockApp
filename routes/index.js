const Router = require('express').Router();
const Stocks = require('./stocks');
const Auth = require('./auth');

module.exports = (context) => {
    Router.use('/stocks', Stocks(context));
    Router.use('/auth', Auth(context));    
    return Router;
}