
const setup = (context) => {
    const { passport } = context;

    const checkIfLoggedIn = (req, res, next) => {
        if (req.user) return res.json({'loggedIn': true});
        next();
    }

    const checkSuccess = (req, res, next) => {
        if (!req.user) return res.json({'success': false});
        return res.json({'success': true});
    };

    return [
        checkIfLoggedIn,
        passport.authenticate('local-login'),
        checkSuccess
    ];
}

module.exports = setup;