module.exports = (context) => {
    return {
        stocks: require('./stocks'), 
        auth: require('./auth')(context)
    }
};