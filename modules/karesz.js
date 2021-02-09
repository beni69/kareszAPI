module.exports = (app, succ, err) => {
    const fs = require("fs");

    app.get("/karesz", (req, res) => {
        res.json({data: "Karesz DB v0.1", time: new Date().toLocaleString()});
    });

    app.get("/karesz/reaction", (req, res) => {
        if (!fs.existsSync("./data/reactionTimes"))
            return err(res, "Data not found!", 503);
        const reactions = fs
            .readFileSync("./data/reactionTimes")
            .toString()
            .trim()
            .split(/\s/)
            .map(x => parseInt(x));

        res.json({data: reactions, average: average(reactions)});
        reactions.len;
    });

    app.post("/karesz/reaction", (req, res) => {
        const time = req.body.time || req.query.time || null;
        if (!time) return err(res, "No data provided");
        if (isNaN(parseInt(time))) return err(res, "Data must be a number");

        if (!fs.existsSync("./data/")) fs.mkdirSync("./data/");
        fs.appendFileSync("./data/reactionTimes", time + "\n");
        succ(res);
    });

    app.delete("/karesz/reaction", (req, res) => {
        const sure = req.body.sure || req.query.sure || false;
        if (!sure) return err(res, "NO");
        fs.rmSync("./data/reactionTimes");
        succ(res);
    });

    function average(array) {
        let sum = 0;
        array.forEach(item => (sum += item));
        return sum / array.length;
    }
};
