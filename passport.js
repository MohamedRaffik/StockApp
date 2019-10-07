const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = (User) => {

    const LoginCallback = (req, username, password, done) => {
        User.get(username)
            .then(user => {
                const equal = bcrypt.compareSync(password, user.hash);
                if (!equal) return done('Invalid Credentials', false);
                return done(null, user);
            })
            .catch(err => done(err, false));
    };

    const SignUpCallback = (req, username, password, done) => {
        const { name } = req.body;
        const hash = bcrypt.hashSync(password, 10);
        const user = new User({ name, email: username, hash });
        user.insert()
            .then(user => done(null, user))
            .catch(err => done(err, false));
    }

    const StrategyOptions = {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    };

    passport.use('local-login', new LocalStrategy(StrategyOptions, LoginCallback));
    passport.use('local-register', new LocalStrategy(StrategyOptions, SignUpCallback));

    passport.serializeUser((user, done) => {
        done(null, user.email);
    });

    passport.deserializeUser((id, done) => {
        User.get(id)
            .then(user => { done(null, user); })
            .catch(err => { done(err, null); })
    });

    return passport;
}