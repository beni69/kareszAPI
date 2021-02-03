const Yeelight = require("yeelight2");
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
            });
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
            });
    },
};

function sleep(time) {
    time = time || 10;
    return function (o) {
        return new Promise(fn => setTimeout(() => fn(o), time));
    };
}
