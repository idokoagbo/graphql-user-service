const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    phone: String,
    country: String,
    password: String,
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);