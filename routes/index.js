const Router = require('express').Router();
const Portfolio = require('./portfolio');
const Auth = require('./auth');
const Transactions = require('./transactions');

module.exports = (context) => {
    Router.use('/transactions', Transactions(context));
    Router.use('/portfolio', Portfolio(context));
    Router.use('/auth', Auth(context));    
    return Router;
}