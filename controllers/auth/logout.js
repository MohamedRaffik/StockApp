const setup = (context) => {

    const { utils } = context;
    const { isAuthenticated } = utils;

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