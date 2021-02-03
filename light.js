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
                light.toggle();
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
                light.set_power("on");
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
