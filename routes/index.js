const Router = require('express').Router();
const Stocks = require('./stocks');
const Auth = require('./auth');

module.exports = (passport) => {
    Router.use('/stocks', Stocks(passport));
    Router.use('/auth', Auth(passport));    
    return Router;
}