// frameworks
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// setup
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

// modules
require("./light.js")(app, succ, err);
require("./karesz.js")(app, succ, err);

app.get("/", (req, res) => {
    res.json({data: "Hello World!", time: new Date().toLocaleString()});
});

app.listen(3333, () => {
    console.log("Server ready!");
});

//* functions
function succ(res, msg = "Success!") {
    res.json({data: msg});
}
function err(res, msg, code = 400) {
    res.status(code).json({data: msg, error: true});
}
