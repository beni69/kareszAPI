module.exports = (app, succ, err) => {
    const fs = require("fs");

    app.get("/karesz", (req, res) => {
        res.json({data: "Karesz DB v0.1", time: new Date().toLocaleString()});
    });

    app.get("/karesz/reaction", (req, res) => {
        //
    });
    app.post("/karesz/reaction", (req, res) => {
        const time = req.body.time || req.query.time || null;
        if (!time) err(res, "No time provided");
    });
};
