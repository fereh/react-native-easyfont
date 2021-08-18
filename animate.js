const fps = 20;
const timeout = 1000 / fps;

const interpols = {
    linear: delta => delta,
    // exponential, quadratic, etc.
};
var interpolate = interpols.linear;

const animate = (duration, stepper, stopper) => {
    let time = 0;
    let delta;
    let interval;

    const stop = () => {
        stopper && stopper();
        clearInterval(interval);
    };

    const handler = () => {
        delta = time / duration;
        delta = interpolate(delta);
        stepper(delta);
        time += timeout;
        if (delta >= 1) {
            stop();
        }
    };

    interval = setInterval(handler, timeout);
};

module.exports = animate;
