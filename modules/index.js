// frameworks
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const chalk = require("chalk");

// setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan(log));
require("../config/db")(); // connect to db
module.exports = { succ, err };
const PORT = config.get("port");

// modules
app.use("/karesz", require("./karesz"));
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
function log(tokens, req, res) {
    const s = tokens.status(req, res);
    let status;
    switch (s[0]) {
        case "2":
            status = chalk.green(s);
            break;
        case "3":
            status = chalk.cyan(s);
            break;
        case "4":
            status = chalk.yellow(s);
            break;
        case "5":
            status = chalk.red(s);
            break;

        default:
            status = s;
            break;
    }

    let msg = [
        chalk.inverse(tokens.method(req, res)),
        status,
        chalk.bold(tokens.url(req, res)),
        chalk.magenta(tokens["response-time"](req, res) + " ms"),
        chalk.blue(req.headers["x-forwarded-for"] || req.socket.remoteAddress),
        tokens["user-agent"](req, res),
    ];

    const ref = tokens.referrer(req, res);
    if (ref) msg.splice(5, 0, chalk.yellow(ref));

    return msg.join(chalk.grey(" - "));
}
