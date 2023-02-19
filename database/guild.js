const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    guild : String,
    i18n: String,
    twitter: String,
    twType : String,
    notice : String
}, { versionKey: false })

module.exports = mongoose.model('guild', Schema)