const mongoose = require("mongoose");
module.exports = mongoose.model(
    "url",
    new mongoose.Schema({
        _id: String,
        url: String,
        dest: String,
        clicks: {type: Number, default: 0},
        date: {type: Number, default: Date.now()},
    })
);
