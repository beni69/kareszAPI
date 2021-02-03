const Yeelight = require("yeelight2");
const api = require("./api");
module.exports = {
    toggle: () => {
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
            .then(sleep());
    },

    on: () => {
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
            .then(sleep());
    },

    off: () => {
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
            .then(sleep());
    },

    color: (res, color, type) => {
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
                // console.log(color);
                if (type == "hex")
                    light.set_rgb("0x" + color.replace(/0x|#/, ""));
                else if (type == "rgb")
                    if (toHexCol(color) != null) light.set_rgb(toHexCol(color));
                // TODO: color names
                return light;
            })
            .then(sleep());
    },
};

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
// const toHexNum = rgb => rgb.toString(16).length < 2 ? "0" + rgb.toString(16) : rgb.toString(16);
function toHexCol(str) {
    const x = str.replace("#", "").split(/\s|,/);
    if (x.length != 3) return null;
    return "0x" + toHexNum(x[0]) + toHexNum(x[1]) + toHexNum(x[2]);
}
