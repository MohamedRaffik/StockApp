
const setup = (passport) => {

    const checkSuccess = (req, res, next) => {
        console.log(req.user);
        if (!req.user) return res.json({'success': false});
        return res.json({'success': true});
    };

    return [
        passport.authenticate('local-login'),
        checkSuccess
    ];
}

module.exports = setup;