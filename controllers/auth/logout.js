const { isAuthenticated } = require('../utils');

const setup = (context) => {
    const Logout = (req, res, next) => {
        req.logout();
        res.send('');
    }

    return [
        isAuthenticated,
        Logout
    ]
}

module.exports = setup;