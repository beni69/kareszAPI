// frameworks
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

// setup
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(helmet());
app.use(morgan(":method :status - :url - :response-time ms - :user-agent"));
require("dotenv").config();
require("../config/db")(); // connect to db
module.exports = {succ, err};

// modules
app.use("/karesz", require("./karesz"));
app.use("/light", require("./light"));
app.use("/", require("./shortener"));

// defaults
app.get("/", (req, res) => {
    res.json({data: "Hello World!", time: new Date().toLocaleString()});
});

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
