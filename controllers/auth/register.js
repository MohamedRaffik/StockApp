const setup = (context) => {

    const { passport, utils } = context; 
    const { validateEmail } = utils;

    const validateBody = (req, res, next) => {
        if (!('email' in req.body)) return res.status(400).json({error: 'Email not specified'});
        if (!('password' in req.body)) return res.status(400).json({error: 'Password not specified'});
        if (!('name' in req.body)) return res.status(400).json({error: 'Name not specified'});
        next();
    }

    const validateRequest = (req, res, next) => {
        const { email, password } = req.body;
        if (!validateEmail(email)) return res.status(400).json({error: 'Invalid Email'})
        if (password.length < 8) return res.status(400).json({error: 'Password length is too short, must be more than 8 characters'})
        next();
    }

    const Register = (req, res, next) => passport.authenticate('local-register', (err, user, info) => {
        if (err) req.body.error = err;
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
        validateBody,
        validateRequest,
        Register,
        sendResponse
    ];
}

module.exports = setup;