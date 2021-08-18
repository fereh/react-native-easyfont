const Instrument = require('./instrument');

const defaultOptions = Object.freeze({
    duration: 3000,
    release: 300,
    speed: 1.0,
    gain: 1.0,
});

/** Manages the playback of a specified set of notes. */
class Player {

    /**
     * @param instrument {Instrument or String} - the instrument to play from
     * @param options {Object}
     */
    constructor(instrument, options) {
        // TODO: decide how much sanity checking to do
        this.instrument = typeof instrument === 'string'
            ? new Instrument(instrument)
            : instrument;

        this.options = defaultOptions;
        if (typeof options === 'object') {
            this.setOptions(options);
        }

        this.sequence = new Sequence();

        this.activeStreams = [];
    }

    setOptions(options) {
        const setRange = (val, min, max) => {
            return ((val < min) && min) || ((val > max) && max) || val;
        };
        options = { ...this.options, ...options };
        options.speed = setRange(options.speed, 0.5, 2.0);
        options.gain = setRange(options.gain, 0.0, 1.0);
        this.options = options;
        return this;
    }

    /**
     * Convenience wrapper for Instrument.prepare
     * @param {Array or String} - note or notes to prepare
     */
    prepare(notes) {
        if (typeof notes === 'string') {
            notes = [ notes ];
        }
        return new Promise((resolve, reject) => {
            this.instrument.prepare(notes, failedNotes => {
                if (failedNotes) {
                    reject(failedNotes);
                }
                else resolve(this);
            });
        });
    }

    /**
     * @param notes {Array or String} - note or notes to play
     * @param when {Number} - when on timeline to play
     *   Timeline starts on first `play()`, and ends after all notes finish playing.
     */
    play(notes, when) {
        this.sequence.start(() => {
            this.instrument.play(notes, this.options.speed, this.options.gain, streams => {
                this.activeStreams.push(streams);
                this.sequence.stop(() => {
                    this.instrument.stop(streams);
                    let i = this.activeStreams.findIndex(x => x === streams[0]);
                    this.activeStreams.slice(i, i + streams.length - 1);
                }, this.options.duration);
            });
        }, when);
    }

    stop() {
        this.instrument.stop(this.activeStreams);
    }
    pause() {
        // not using autoPause() because other Players could be using the instrument
        this.instrument.pause(this.activeStreams);
    }
    resume() {
        this.instrument.resume(this.activeStreams);
    }
}

/** Controls timing of notes being played via the Player. */
class Sequence {
    constructor() {
        this.ts = null;
        this.count = 0;
    }
    progress(ts) {
        if (this.ts === null) {
            this.ts = ts;
            return 0;
        }
        return ts - this.ts;
    }
    start(handler, when, ...args) {
        when -= this.progress(Date.now());
        if (when > 0) {
            setTimeout(handler, when, ...args);
        }
        else handler(...args);
        this.count++;
    }
    stop(handler, when, ...args) {
        setTimeout(() => {
            handler(...args);
            if (--this.count === 0) {
                this.ts = null;
            }
        }, when);
    }
}

module.exports = Player;
