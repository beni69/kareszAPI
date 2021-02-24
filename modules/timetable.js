const express = require("express");
const router = express.Router();
const config = require("config");
const { succ, err, getDate } = require("./index");
const fs = require("fs");
const jsonc = require("jsonc");
const file = fs.readFileSync("./config/timetable.jsonc").toString().trim();
const table = jsonc.parse(file);

router.get("/", (_req, res) => {
    res.json(table);
});

router.get("/day", (req, res) => {
    res.json(table[new Date().getDay()]);
});

router.get("/now", (req, res) => {
    const date = getDate(1);
    const day = table[date.getDay()];
    const lesson = day[date.getHours() - 8];
    res.json(`${lesson}`);
});

router.get("/next", (req, res) => {
    const date = getDate(1);
    const day = table[date.getDay()];
    const lesson = day[date.getHours() - 7];
    res.json(`${lesson}`);
});

module.exports = router;
