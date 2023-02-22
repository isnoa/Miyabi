const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    since : String,
    user : String,
    i18n : String,
    nowcharacter : String,
    profileconnect : Boolean,
    description : String,
    zzzconnect : String,
    uid : Number,
    dailycheckin : Boolean
}, { versionKey: false })

module.exports = mongoose.model('user', Schema)