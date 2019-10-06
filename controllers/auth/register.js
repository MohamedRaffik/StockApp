const { validateEmail } = require('../utils');

const setup = (context) => {

    const { passport } = context; 

    const validateRequest = (req, res, next) => {
        const { email, password } = req.body;
        if (!validateEmail(email)) return res.json({error: 'Invalid Email'})
        if (password.length < 8) return res.json({error: 'Password length is too short, must be more than 8 characters'})
        next();
    }

    const Register = (req, res, next) => passport.authenticate('local-register', (err, user, info) => {
        if (err) return res.json({error: err})
        req.login(user, err => {
            if (err) return res.json({error: 'Unable to login after register'})
            const { email, name, cash } = req.user.data;
            return res.json({username: email, name});
        });
    })(req, res, next);

    return [
        validateRequest,
        Register,
    ];
}

module.exports = setup;