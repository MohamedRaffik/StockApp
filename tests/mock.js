class Response {
    status() { return this; }
    json() { return this; }
    end() {}
};

const context = {
    utils: require('../controllers/utils'),
    passport: {
        authenticate: (string, callback) => (req, res, next) => {
            const user = {
                email: 'someemail@gmail.com',
                name: 'John Doe',
                password: 'password'
            };
            callback(false, user);
        }
    }
};

module.exports = {
    Response,
    context
};