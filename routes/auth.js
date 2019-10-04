const Router = require('express').Router();

module.exports = (passport) => {
    const { auth } = require('../controllers')(passport);

    Router.post('/login', auth.login);
    Router.post('/register', auth.register);
    return Router;
}