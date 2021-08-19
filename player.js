const Instrument = require('./instrument');

// TODO: jsdoc these options
const defaultOptions = Object.freeze({
    duration: 3000,
    release: 300,
    speed: 1.0,
    gain: 1.0,
});

/** Manages the playback notes in an instrument. */
class Player {

    /**
     * @param instrument {Instrument|string} - The instrument to play from
     * @param options {Object}
     */
    constructor(instrument, options) {
        this.instrument = instrument;
        if (typeof instrument === 'string') {
            this.instrument = new Instrument(instruent);
        }
        this.options = defaultOptions;
        this.config(options);
        this.sequence = new Sequence();
        this.activeStreams = [];
    }

    config(options) {
        this.options = { ...this.options, ...options, };
        return this;
    }

    /**
     * Convenience promise wrapper for {@link Instrument}'s `prepare`.
     * @param {string[]|string} notes
     */
    prepare(notes) {
        if (typeof notes === 'string') {
            notes = [ notes ];
        }
        return new Promise((resolve, reject) => {
            this.instrument.prepare(notes, failedNotes => {
                if (failedNotes) reject();
                else resolve(this);
            });
        });
        return this;
    }

    /**
     * @param notes {string[]|string} notes
     * @param {number} when - When on timeline to play note(s); millisecond precision.
     *   Timeline starts on first `play()`, and ends after all notes finish playing.
     */
    play(notes, when) {
        // TODO: play silence before/after sounds?
        this.sequence.start(() => {
            this.instrument.play(notes, this.options.speed, this.options.gain, streams => {
                this.activeStreams.push(streams);
                this.sequence.stop(() => {
                    // TODO: run release envelop, then stop
                    this.instrument.stop(streams);

                    let i = this.activeStreams.findIndex(x => x === streams[0]);
                    this.activeStreams.slice(i, i + streams.length - 1);
                }, this.options.duration);
            });
        }, when);
        return this;
    }

    /**
     * Stop all playing notes.
     */
    stop() {
        this.instrument.stop(this.activeStreams);
        return this;
    }

    /**
     * Pause all playing notes.
     */
    pause() {
        // pauseAll() will break other players of same instrument,
        // so pause streams individually
        this.instrument.pause(this.activeStreams);
        return this;
    }

    /**
     * Resume all paused notes.
     */
    resume() {
        this.instrument.resume(this.activeStreams);
        return this;
    }

}

/**
 * @private
 * Controls timing of notes being played via the Player.
 */
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
