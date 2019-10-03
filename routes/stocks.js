const Router = require('express').Router();
const { stocks } = require('../controllers');
const API_KEY = process.env.API_KEY;

Router.get('/', stocks.update);

module.exports = Router;