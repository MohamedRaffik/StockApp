module.exports = (passport) => {
    return {
        stocks: require('./stocks'), 
        auth: require('./auth')(passport)
    }
};