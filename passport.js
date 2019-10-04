const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models');

const LoginCallback = async (req, username, password, done) => {
    try {
        const user = await User.get(username);
        if (!user) return done(null, false);
        const equal = bcrypt.compareSync(password, user.data.hash);
        if (!equal) return done(null, false);
        return done(null, user);
    } catch (e) {
        return done(err, false);
    }
};

const SignUpCallback = async (req, username, password, done) => {
    try {
        let user = await User.get(username);
        if (user) return done(null, false);
        const { name, email } = req.body;
        const hash = bcrypt.hashSync(password, 10);
        user = new User({name, email, hash});
        const success = await user.insert();
        if (!success) return done(null, false);
        return done(null, user);
    } catch (e) {
        return done(e, false);
    }
}

const StrategyOptions = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
};

passport.use('local-login', new LocalStrategy(StrategyOptions, LoginCallback));
passport.use('local-register', new LocalStrategy(StrategyOptions, SignUpCallback));

passport.serializeUser((user, done) => {
    done(null, user.data.email);
});

passport.deserializeUser((id, done) => {
    User.get(id)
        .then(user => { done(null, user); })
        .catch(err => { done(err, null); })
});

module.exports = passport;