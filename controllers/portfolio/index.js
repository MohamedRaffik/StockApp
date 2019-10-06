module.exports = (context) =>  {
    return {
        update: require('./update')(context)
    };
};