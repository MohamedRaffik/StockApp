module.exports = {
    validateEmail : (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    isAuthenticated: (req, res, next) => {
        if (!req.user) return res.status(401).json({error: 'Unauthorized'});
        console.log('hi')
        next();
    }
};