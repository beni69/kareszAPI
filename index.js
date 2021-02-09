// frameworks
const express = require("express");
const bodyParser = require("body-parser");

// setup
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// modules
require("./modules/light.js")(app, succ, err);
require("./modules/karesz.js")(app, succ, err);

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
    res.status(code).json({data: "Error!", error: msg});
}
