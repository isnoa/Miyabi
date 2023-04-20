const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: { type: String },
    lastAgent: { type: String },
    zzzConnect: { type: String },
    zzzDate: { type: String },
    zzzLevel: { type: Number },
    zzzUID: { type: Number },
    dailyCheckIn: { type: Boolean },
    publicProfile: { type: Boolean },
    publicProfile: { type: Boolean },
    privateProfile: { type: Boolean },
    uidShow: { type: Boolean }
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);