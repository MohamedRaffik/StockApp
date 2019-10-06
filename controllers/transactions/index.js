module.exports = (context) => {
    return {
        add: require('./add')(context),
        list: require('./list')(context)
    };
};