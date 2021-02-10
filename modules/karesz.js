module.exports = (app, succ, err) => {
    const fs = require("fs");

    app.get("/karesz", (req, res) => {
        res.json({
            data: "Karesz DB v1.0",
            time: new Date().toLocaleString(),
            url: process.env.KARESZ_URL,
        });
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

        res.json({
            data: reactions,
            average: average(reactions),
            max: max(reactions),
            min: min(reactions),
        });
    });

    app.post("/karesz/reaction", (req, res) => {
        const time = req.body.time || req.query.time || null;

        if (req.headers.origin != process.env.KARESZ_URL)
            return err(res, "Fuck off", 403);
        else if (!time) return err(res, "No time provided");
        else if (isNaN(parseInt(time)))
            return err(res, "Data must be a number");
        else if (parseInt(time) > 1000 || parseInt(time) < 69) return succ(res);

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
    function max(array) {
        let best = -1;
        array.forEach(item => {
            if (item > best) best = item;
        });
        return best;
    }
    function min(array) {
        let best = Number.MAX_VALUE;
        array.forEach(item => {
            if (item < best) best = item;
        });
        return best;
    }
};
