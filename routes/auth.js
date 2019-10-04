const Router = require('express').Router();

module.exports = (context) => {
    const { auth } = require('../controllers')(context);

    Router.post('/login', auth.login);
    Router.post('/register', auth.register);
    return Router;
}