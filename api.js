const express = require("express");
const app = express();
const light = require("./light");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    succ(res, "Hello World!");
});

app.post("/toggle", (req, res) => {
    light.toggle();
    succ(res);
});

app.post("/on", (req, res) => {
    light.on();
    res.json({data: "Success!"});
});

app.post("/off", (req, res) => {
    light.off();
    res.json({data: "Success!"});
});

app.post("/color", (req, res) => {
    const color = req.body.color || req.query.color;
    if (!color) return err(res, "No color provided.");
    const type = req.body.type || req.query.type;
    if (!type) return err(res, "No color type provided.");
    light.color(res, color, type);
    succ(res);
});

app.listen(3333, () => {
    console.log("Server ready!");
});

//*
function succ(res, msg = "Success!") {
    res.json({data: msg});
}
function err(res, msg, code = 400) {
    res.status(code).json({data: "Error!", error: msg});
}

module.exports = {succ: succ, err: err};
