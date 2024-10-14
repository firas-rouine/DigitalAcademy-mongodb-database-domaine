const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    userId: String,
    username: String,
    email: String,
    phone: String,
    timestamp: Date
});

module.exports = mongoose.model('Log', logSchema);
