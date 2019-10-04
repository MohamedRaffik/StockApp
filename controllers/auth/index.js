module.exports = (passport) => {
    return {
        login: require('./login')(passport),
        register: require('./register')(passport)
    };
};