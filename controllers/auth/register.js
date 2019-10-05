const { validateEmail } = require('../utils');

const setup = (context) => {

    const { passport } = context; 

    const validateRequest = (req, res, next) => {
        const { email, password } = req.body;
        if (!validateEmail(email)) return res.json({error: 'Invalid Email'})
        if (password.length < 8) return res.json({error: 'Password length is too short'})
        next();
    }

    const Register = (req, res, next) => passport.authenticate('local-register', (err, user, info) => {
        if (err) return res.json({error: err})
        req.login(user, err => {
            if (err) return res.json({error: 'Unable to login after register'})
            return res.json({username: user.data.email, name: user.data.name});
        });
    })(req, res, next);

    return [
        validateRequest,
        Register,
    ];
}

module.exports = setup;