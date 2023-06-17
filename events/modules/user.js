const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        userId: { required: true, type: String },
        dailyCheckIn: { type: Boolean, default: null },
        privateProfile: { type: Boolean, default: null },
        publicProfile: { type: Boolean, default: null },
        showUID: { type: Boolean, default: null },
        zzzConnect: { type: String, default: null },
        zzzDate: { type: String, default: null },
        zzzUID: { type: Number, default: null }
    },
    { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("user", userSchema);