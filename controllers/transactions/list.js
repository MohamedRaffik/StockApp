const { isAuthenticated } = require('../utils');

const setup = (context) => {

    const listTransactions = (req, res) => {
        const { transactions } = req.user.data;
        return res.json({transactions});
    }

    return [
        isAuthenticated,
        listTransactions
    ];
};

module.exports = setup;