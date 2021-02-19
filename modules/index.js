// frameworks
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");

// setup
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
const log =
    ":method :status - :url - :response-time ms - :remote-addr - :user-agent";
app.use(morgan(log));
require("../config/db")(); // connect to db
module.exports = { succ, err };
const PORT = config.get("port");

// modules
app.use("/karesz", require("./karesz"));
app.use("/light", require("./light"));
app.use("/", require("./shortener"));

// defaults
app.get("/", (req, res) => {
    // if url shortener => redirect, otherwise don't
    if (req.hostname == "krsz.me" || req.hostname == "u.karesz.xyz")
        res.redirect(301, "http://krsz.me/new");
    else res.json({ data: "Hello World!", time: new Date().toLocaleString() });
});

// TODO: TRACE /
// for testing
// app.trace("/", (req, res) => {
//     res.json(JSON.stringify(req));
//     console.log(req);
// });

app.listen(PORT, () => {
    console.log(`Server ready on ${PORT}`);
});

// functions
function succ(res, msg = "Success!") {
    res.json({ data: msg });
}
function err(res, msg, code = 400) {
    res.status(code).json({ data: msg });
}
