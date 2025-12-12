const mongoose = require('mongoose');

const SearchHistorySchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
    },
    temp: {
        type: Number,
        required: true,
    },
    condition: {
        type: String,
        required: true,
    },
    searchDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('SearchHistory', SearchHistorySchema);
