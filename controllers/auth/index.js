module.exports = (context) => {
    return {
        login: require('./login')(context),
        register: require('./register')(context)
    };
};