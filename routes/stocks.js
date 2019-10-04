const Router = require('express').Router();

module.exports = (passport) => {
    const { stocks } = require('../controllers')(passport);

    Router.get('/', stocks.update);
    return Router;
}