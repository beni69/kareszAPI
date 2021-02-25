const mongoose = require("mongoose");

const url = new mongoose.Schema({
    _id: String,
    url: String,
    dest: String,
    clicks: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
    key: String,
    __v: { type: Number, default: 1 },
});
const model = mongoose.model("url", url);

module.exports = model;
