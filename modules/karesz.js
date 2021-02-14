module.exports = (app, succ, err) => {
    const reaction = require("../models/reaction");

    app.get("/karesz", (req, res) => {
        res.json({
            data: "Karesz DB v1.0",
            time: new Date().toLocaleString(),
            url: process.env.KARESZ_URL,
        });
    });

    app.get("/karesz/reaction", async (req, res) => {
        let reactions = [];
        await reaction.find({}, (error, res2) => {
            if (error) return res.status(500).send(error);
            res2.forEach(item => reactions.push(item.time));
        });

        res.json({
            data: reactions,
            average: average(reactions),
            max: max(reactions),
            min: min(reactions),
        });
    });

    app.post("/karesz/reaction", async (req, res) => {
        const time = req.body.time || req.query.time || null;
        const data = new reaction({time, date: Date.now()});

        await data.save();
        succ(res);
    });

    app.delete("/karesz/reaction", (req, res) => {
        // const sure = req.body.sure || req.query.sure || false;
        // if (!sure) return err(res, "NO");
        // fs.rmSync("./data/reactionTimes");
        // succ(res);
        // TODO: remove support
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
