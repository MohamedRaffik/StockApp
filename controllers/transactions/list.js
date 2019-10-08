const setup = (context) => {

    const { utils } = context;
    const { isAuthenticated } = utils;

    const listTransactions = (req, res) => {
        const { transactions } = req.user;
        return res.json({transactions});
    }

    return [
        isAuthenticated,
        listTransactions
    ];
};

module.exports = setup;