const Router = require('express').Router();
const Portfolio = require('./portfolio');
const Auth = require('./auth');

module.exports = (context) => {
    Router.use('/portfolio', Portfolio(context));
    Router.use('/auth', Auth(context));    
    return Router;
}