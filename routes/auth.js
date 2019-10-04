const Router = require('express').Router();

module.exports = (passport) => {
    const { auth } = require('../controllers')(passport);

    Router.get('/', (req, res, next) => {
        console.log('hi');
        return res.send('hi');
    });
    Router.post('/login', auth.login)
    Router.post('/register', auth.register);
    return Router;
}