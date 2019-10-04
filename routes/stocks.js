const Router = require('express').Router();

module.exports = (context) => {
    const { stocks } = require('../controllers')(context);

    Router.get('/', stocks.update);
    return Router;
}