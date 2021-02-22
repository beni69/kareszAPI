const express = require("express");
const router = express.Router();
const config = require("config");
const { succ, err } = require("./index");
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
    const date = getDate();
    const day = table[date.getDay()];
    const lesson = day[date.getHours() - 8];
    res.json(lesson);
});

router.get("/next", (req, res) => {
    const now = getDate();
    const day = table[now.getDay()];
    const p = now.getHours() - 7;
    res.json(day[p]);
});

function getDate() {
    const date = new Date();
    date.setHours(date.getHours() + date.getTimezoneOffset() / 60 + 1);
}

module.exports = router;
