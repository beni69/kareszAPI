const express = require("express");
const router = express.Router();
const reaction = require("../models/reaction");
const config = require("config");
const { succ, err } = require("./index");

router.get("/", (req, res) => {
    res.json({
        data: "Karesz DB v2.0",
        time: new Date().toLocaleString(),
        url: config.get("kareszurl"),
    });
});

router.get("/reaction", async (req, res) => {
    let reactions = [];
    while (reactions.length == 0) {
        await reaction.find({}, (error, res2) => {
            if (error) return res.status(500).send(error);
            res2.forEach(item => reactions.push(item.time));
        });
    }

    res.json({
        average: average(reactions),
        max: max(reactions),
        min: min(reactions),
        length: reactions.length,
        data: reactions,
    });
});

router.post("/reaction", async (req, res) => {
    const time = req.body.time || req.query.time || null;
    const data = new reaction({ time });

    await data.save();
    succ(res);
});

router.delete("/reaction", async (req, res) => {
    // TODO: remove all, maybe?
    // (gotta set up auth for that)
    const time = req.body.time || req.query.time || null;
    if (time == null) return err(res, "Please provide a time");
    if (!(await reaction.exists({ time })))
        return err(res, "No data exists with that time");

    const deleted = await reaction.findOneAndDelete({ time });
    res.json({ data: "Success!", deleted });
});

function average(array) {
    let sum = 0;
    array.forEach(item => (sum += item));
    return sum / array.length;
}
function max(array) {
    let best = -1;
    array.forEach(item => {
        if (item > best) best = item;
    });
    return best;
}
function min(array) {
    let best = Number.MAX_VALUE;
    array.forEach(item => {
        if (item < best) best = item;
    });
    return best;
}

module.exports = router;
