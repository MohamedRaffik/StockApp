const Router = require('express').Router();
const Stocks = require('./stocks');

Router.use('/stocks', Stocks);

module.exports = Router;