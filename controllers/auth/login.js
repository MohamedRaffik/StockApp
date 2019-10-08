const setup = (context) => {

    const { passport, utils } = context;
    const { validateEmail } = utils;

    const checkIfLoggedIn = (req, res, next) => {
        if (req.user) {
            const { email, name } = req.user;
            return res.json({username: email, name});
        }
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
            if (err) {
                console.log(err);
                return res.json({error: err});
            }
            const { email, name } = req.user;
            return res.json({username: email, name});        
        });
    })(req, res, next);

    return [
        checkIfLoggedIn,
        validateRequest,
        Login,
    ];
}

module.exports = setup;