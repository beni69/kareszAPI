const express = require("express");
const router = express.Router();
const { succ, err } = require("./index");

const Yeelight = require("yeelight2");

router.get("/", (req, res) => {
    res.json({ data: "LightAPI v0.1.2", time: new Date().toLocaleString() });
});

router.post("/toggle", (req, res) => {
    Promise.resolve()
        .then(
            () =>
                new Promise(accept => {
                    Yeelight.discover(function (light) {
                        this.close();
                        accept(light);
                    });
                })
        )
        .then(light => {
            light.toggle().then(console.log("Toggle succeeded"));
            return light;
        })
        .then(succ(res))
        .then(sleep());
});

router.post("/on", (req, res) => {
    Promise.resolve()
        .then(
            () =>
                new Promise(accept => {
                    Yeelight.discover(function (light) {
                        this.close();
                        accept(light);
                    });
                })
        )
        .then(light => {
            light.set_power("on").then(console.log("Power on succeeded"));
            return light;
        })
        .then(succ(res))
        .then(sleep());
});

router.post("/off", (req, res) => {
    Promise.resolve()
        .then(
            () =>
                new Promise(accept => {
                    Yeelight.discover(function (light) {
                        this.close();
                        accept(light);
                    });
                })
        )
        .then(light => {
            light.set_power("off").then(console.log("Power off succeeded"));
            return light;
        })
        .then(succ(res))
        .then(sleep());
});

router.post("/color", (req, res) => {
    const color = req.body.color || req.query.color || null;
    const type = req.body.type || req.query.type || null;
    Promise.resolve()
        .then(
            () =>
                new Promise(accept => {
                    Yeelight.discover(function (light) {
                        this.close();
                        accept(light);
                    });
                })
        )
        .then(light => {
            console.log({ color: color, type: type });
            if (type == "hex")
                light.set_rgb("0x" + color.replace(/0x|#/, "")).then(() => {
                    console.log(`Set color to ${color} succeeded`);
                    succ(res);
                });
            else if (type == "rgb") {
                if (toHexCol(color) != null)
                    light.set_rgb(toHexCol(color)).then(() => {
                        console.log(`Set color to ${color} succeeded`);
                        succ(res);
                    });
                else err(res, "Invalid RGB format");
            } else if (type == "name") {
                const colors = require("./colors.json");
                let suc = false;
                colors.forEach(item => {
                    if (item.name.toLowerCase() == color.toLowerCase()) {
                        light.set_rgb("0x" + item.hex).then(() => {
                            console.log(`Set color to ${color} succeeded`);
                            succ(res);
                        });
                        suc = true;
                    }
                });
                if (!suc) err(res, "Invalid color name");
            } else err(res, "Invalid color type format");
            return light;
        })
        .then(sleep());
});

// app.listen(3333, () => {
//     console.log("Server ready!");
// });

//* functions
// function succ(res, msg = "Success!") {
//     res.json({data: msg});
// }
// function err(res, msg, code = 400) {
//     res.status(code).json({data: "Error!", error: msg});
// }

function sleep(time) {
    time = time || 10;
    return function (o) {
        return new Promise(fn => setTimeout(() => fn(o), time));
    };
}
function toHexNum(input) {
    let hex = Number(input.trim()).toString(16);
    if (hex.length < 2) hex = "0" + hex;
    return hex;
}
function toHexCol(str) {
    const x = str.replace(/#|0x/, "").split(/ |,|\t/);
    if (x.length != 3) return null;
    return "0x" + toHexNum(x[0]) + toHexNum(x[1]) + toHexNum(x[2]);
}

module.exports = router;
