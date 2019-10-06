module.exports = (context) => {
    return {
        portfolio: require('./portfolio')(context), 
        auth: require('./auth')(context),
    }
};