const mongoose = require('mongoose')

const guildProfileSchema = new mongoose.Schema({
    guildID: { type: String, require: true, unique:true },
    IP: { type: String },
    Seed: { type: Number }
})

const model = mongoose.model("mcsrv-discord-bot", guildProfileSchema);

module.exports = model;