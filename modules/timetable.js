const express = require("express");
const router = express.Router();
const config = require("config");
const { succ, err } = require("./index");
const fs = require("fs");
const jsonc = require("jsonc");

router.get("/", (req, res) => {
    const file = fs.readFileSync("./config/timetable.jsonc").toString();
    const json = jsonc.parse(file);

    console.log(json);
    res.json(json);
    // res.json(require("../config/timetable.jsonc"));
});

module.exports = router;
