const setup = (context) => {

    const { passport, utils } = context;
    const { validateEmail, validateFields } = utils;

    const checkIfLoggedIn = (req, res, next) => {
        if (req.user) {
            const { email, name } = req.user;
            return res.status(200).json({ username: email, name });
        }
        next();
    }

    const validateRequest = (req, res, next) => {
        const error = validateFields(req.body, ['email']);
        if (error) {
            return res.status(400).json({ error });
        }
        const { email } = req.body;
        if (!validateEmail(email)) {
            return res.json({error: 'Invalid email'});
        }
        next();
    }

    const Login = (req, res, next) => passport.authenticate('local-login', (err, user, info) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: err });
        }
        else {
            req.login(user, err => {
                if (err) req.body.error = err;
            });
        }
        next()
    })(req, res, next);

    const sendResponse = (req, res, next) => {
        const { error } = req.body;
        if (error) {
            return res.status(500).json({error});
        }
        const { email, name } = req.user;
        return res.status(200).json({username: email, name});
    };

    return [
        checkIfLoggedIn,
        validateRequest,
        Login,
        sendResponse,
    ];
}

module.exports = setup;