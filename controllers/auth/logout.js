const setup = (context) => {

    const { utils } = context;
    const { isAuthenticated } = utils;

    const Logout = (req, res, next) => {
        req.logout();
        res.status(200).end();
    }

    return [
        isAuthenticated,
        Logout
    ]
}

module.exports = setup;