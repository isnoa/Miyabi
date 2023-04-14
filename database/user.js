const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: { type: String },
    lastAgent: { type: String },
    viewProfile: { type: Boolean },
    introduce: { type: String },
    zzzConnect: { type: String },
    uid: { type: Number },
    zzzLevel: { type: Number },
    zzzDate: { type: String },
    dailyCheckIn: { type: Boolean }
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);