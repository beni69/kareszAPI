// frameworks
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const https = require("https");

// setup
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
const key = fs.readFileSync(__dirname + "/../selfsigned.key");
const cert = fs.readFileSync(__dirname + "/../selfsigned.crt");
const options = {key: key, cert: cert};

// modules
require("./light.js")(app, succ, err);
require("./karesz.js")(app, succ, err);

// defaults
app.get("/", (req, res) => {
    res.json({data: "Hello World!", time: new Date().toLocaleString()});
});

const server = https.createServer(options, app);

app.listen(3333, () => {
    console.log("Server ready!");
});

// functions
function succ(res, msg = "Success!") {
    res.json({data: msg});
}
function err(res, msg, code = 400) {
    res.status(code).json({data: msg});
}
