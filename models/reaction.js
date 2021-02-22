const mongoose = require("mongoose");

module.exports = mongoose.model(
    "reaction",
    new mongoose.Schema({
        time: Number,
        date: { type: Number, default: Date.UTC() },
    })
);
