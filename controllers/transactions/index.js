module.exports = (context) => {
    return {
        purchase: require('./purchase')(context),
        list: require('./list')(context),
        sell: require('./sell')(context)
    };
};