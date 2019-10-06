const Router = require('express').Router();

module.exports = (context) => {
    const { portfolio } = require('../controllers')(context);

    Router.get('/', portfolio.update);
    return Router;
}