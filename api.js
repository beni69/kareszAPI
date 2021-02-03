const express = require("express");
const app = express();
const light = require("./light");

app.get("/light", (req, res, next) => {
    res.json({data: "Hello World!"});
});

app.post("/light/toggle", (req, res, next) => {
    light.toggle();
    res.status(200).json({data: "Success!"});
});

app.post("/light/on", (req, res, next) => {
    light.on();
    res.status(200).json({data: "Success!"});
});

app.listen(3333, () => {
    console.log("Server ready!");
});
