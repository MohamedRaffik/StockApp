const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models');

const LoginCallback = (req, username, password, done) => {
    User.get(username)
        .then(user => {
            if (!user) return done(null, false);
            //check password
            return done(null, user);
        })
        .catch(err => done(err));
};

const SignUpCallback = (req, username, password, done) => {
    User.get(username)
        .then(user => {
            if (user) return done(null, false);
            //Create account and hash password
            return done(null, user);
        })
        .catch(err => done(err))
}

const StrategyOptions = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
};

passport.use('local-login', new LocalStrategy(StrategyOptions, LoginCallback));
passport.use('local-register', new LocalStrategy(StrategyOptions, SignUpCallback));

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser((id, done) => {
    User.get(id)
        .then(user => { done(null, user); })
        .catch(err => { done(err, null); })
});

module.exports = passport;