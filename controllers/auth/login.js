const { validateEmail } = require('../utils');

const setup = (context) => {

    const { passport } = context;

    const checkIfLoggedIn = (req, res, next) => {
        if (req.user) return res.json({username: req.user.data.email, name: req.user.data.name});
        next();
    }

    const validateRequest = (req, res, next) => {
        const { email } = req.body;
        if (!validateEmail(email)) return res.json({error: 'Invalid email'});
        next();
    }

    const Login = (req, res, next) => passport.authenticate('local-login', (err, user, info) => {
        if (err) return res.json({error: err})
        req.login(user, err => {
            if (err) return res.json({error: 'Unable to login'})
            return res.json({username: user.data.email, name: user.data.name});
        });
    })(req, res, next);

    return [
        checkIfLoggedIn,
        validateRequest,
        Login,
    ];
}

module.exports = setup;