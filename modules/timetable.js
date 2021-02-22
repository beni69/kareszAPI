const express = require("express");
const router = express.Router();
const config = require("config");
const { succ, err } = require("./index");
const fs = require("fs");
const jsonc = require("jsonc");
const file = fs.readFileSync("./config/timetable.jsonc").toString();
const table = jsonc.parse(file);

router.get("/", (req, res) => {
    res.json(table);
});

router.get("/day", (req, res) => {
    res.json(table[new Date().getDay()]);
});

router.get("/now", (req, res) => {
    const now = new Date();
    const day = table[now.getDay()];
    const p = now.getHours() - 8;
    res.json(day[p]);
});

router.get("/next", (req, res) => {
    const now = new Date();
    const day = table[now.getDay()];
    const p = now.getHours() - 7;
    res.json(day[p]);
});

module.exports = router;
