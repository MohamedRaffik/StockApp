const setup = (context) => {

    const { passport, utils } = context; 
    const { validateEmail, validateFields } = utils;

    const validateRequest = (req, res, next) => {
        const error = validateFields(req.body, ['email', 'password', 'name']);
        if (error) {
            return res.status(400).json({ error });
        } 
        const { email, password } = req.body;
        if (!validateEmail(email)) {
            return res.status(400).json({error: 'Invalid Email'});
        }
        if (password.length < 8) {
            return res.status(400).json({error: 'Password length is too short, must be more than 8 characters'});
        }
        next();
    }

    const Register = (req, res, next) => passport.authenticate('local-register', (err, user, info) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        else {
            req.login(user, err => {
                if (err) req.body.error = err;
            });
        }
        next();
    })(req, res, next);

    const sendResponse = (req, res, next) => {
        const { error } = req.body;
        if (error) return res.status(500).json({error: error});
        const { email, name } = req.user;
        return res.status(200).json({username: email, name});
    };

    return [
        validateRequest,
        Register,
        sendResponse
    ];
}

module.exports = setup;