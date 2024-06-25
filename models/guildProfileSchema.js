const mongoose = require('mongoose')

const guildProfileSchema = new mongoose.Schema({
    guildId: { type: String, require: true, unique:true },
    IP: { type: String },
    Seed: { type: Number }
})

const model = mongoose.model("guild", guildProfileSchema);

module.exports = model;