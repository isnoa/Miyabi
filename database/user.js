const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    user : String,
    timestamp : String,
    lastcharacter : String,
    viewprofile : Boolean,
    introduce : String,
    zzzconnect : String,
    uid : Number,
    zzzdate: String,
    zzzlevel: Number,
    dailycheckin : Boolean
}, { versionKey: false })

module.exports = mongoose.model('user', Schema)