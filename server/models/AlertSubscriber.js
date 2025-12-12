// server/models/AlertSubscriber.js

const mongoose = require('mongoose');

const AlertSubscriberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AlertSubscriber', AlertSubscriberSchema);
