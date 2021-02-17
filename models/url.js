const mongoose = require("mongoose");
module.exports = mongoose.model(
    "url",
    new mongoose.Schema({
        _id: String,
        _v: {type: Number, default: 0},
        url: String,
        dest: String,
        clicks: {type: Number, default: 0},
        timestamp: {type: Number, default: Date.now()},
    })
);
