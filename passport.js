const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models');

const LoginCallback = (req, username, password, done) => {
    User.findOne(username)
        .then(user => {
            if (!user) return done(null, false);
            console.log(user);
            //check password
            return done(null, user);
        })
        .catch(err => done(err));
};

const SignUpCallback = (req, username, password, done) => {
    User.findOne(username)
        .then(user => {
            if (user) return done(null, false);
            //Create account and hash password
            return done(null, user);
        })
        .catch(err => done(err))
}

const StrategyOptions = {
    usernameField: 'email',
    passReqToCallback: true
};

passport.use('local-login', new LocalStrategy(StrategyOptions, LoginCallback));
passport.use('local-signup', new LocalStrategy(StrategyOptions, SignUpCallback));

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((id, done) => {
    User.findOne({ email: id }, (err, user) => {
        done(err, user);
    });
});

module.exports = passport;