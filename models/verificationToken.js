const mongoose = require('mongoose');

const verificationTokenSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    token: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: Date.now() + (24 * 60 * 60 * 1000) } //expires in 1 day
});

module.exports = mongoose.model('VerificationToken', verificationTokenSchema);