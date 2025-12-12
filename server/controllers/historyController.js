const SearchHistory = require('../models/SearchHistory');

const getHistory = async (req, res) => {
    try {
        const history = await SearchHistory.find()
            .sort({ searchDate: -1 })
            .limit(5);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getHistory
};
