const { NativeModules, } = require('react-native');
const { SoundPool, } = NativeModules;

const range = (v, n, x) => ((v < n) && n) || ((v > x) && x) || v;

/**
 * Abstract: Collection of related 'soundfonts'
 * Frontend for SoundPool with safety checks and convenience features.
 */
class Instrument {

    /**
     * @param {string} name - An instrument name (see example)
     * @param {number} [maxStreams] - Number of sounds able to play simultainiously
     * @example
     *   Instrument of name 'violin', preparing note 'A0' will map to resource 'raw/violin_a0.mp3';
     *   note 'C4' to 'raw/violin_c4.mp3', etc..
     */
    constructor(name, maxStreams) {
        this.name = name;
        this.sounds = {};
        this.soundPromises = {};
        maxStreams = maxStreams ? range(maxStreams, 0, 12) : 6;
        SoundPool.create(maxStreams);
    }

    release() {
        this.sounds = null;
        this.soundPromises = null;
        SoundPool.release();
    }

    /**
     * @callback prepareCallback
     * @param {number[]} failedNotes - `null` on success, or list of note that failed to load
     */

    /**
     * Try to garentee that notes are ready for playback.
     * @param {string[]} notes
     * @param {prepareCallback} callback - called when all `notes` are prepared
     */
    prepare(notes, callback) {
        if (__DEV__) {
            if (!Array.isArray(notes) || typeof notes[0] !== 'string') {
                throw new TypeError();
            }
            if (typeof callback !== 'function') {
                throw new TypeError();
            }
        }

        let failedNotes = [];
        let progress = 0;
        const advance = () => {
            if (++progress === notes.length) {
                callback(failedNotes.length === 0 ? null : failedNotes);
            }
        };
        for (let note of notes) {
            note = note.toLowerCase();
            if (note in this.sounds) {
                advance();
                continue;
            }

            let promise;
            if (note in this.soundPromises) {
                promise = this.soundPromises[note];
            }
            else {
                promise = SoundPool.load(`${this.name}_${note}`);
                this.soundPromises[note] = promise;
            }
            promise.then(sound => {
                // in case of multiple listeners, the first will remove the promise
                if (note in this.soundPromises) {
                    this.sounds[note] = sound;
                    this.soundPromises[note] = undefined;
                }
            });
            promise.catch(e => {
                // failed note promises are never removed, so that future calls immediately fail
                failedNotes.push(note);
                console.error('Failed to load', note);
                console.debug(e);
            });
            promise.finally(() => {
                advance();
            });
        }
    }

    /**
     * @callback playCallback
     * @param {number[]} streams - stream handles used in controlling playback, or `null` on error
     */

    /**
     * @param {string[]} notes
     * @param {playCallback} callback - called when sounds are queued in the native layer
     * @param {number} [gain] - gain/volume multiplier (0.0 - 1.0)
     * @param {number} [speed] - speed multiplier (0.5 - 2.0)
     */
    play(notes, callback, gain, rate) {
        if (__DEV__) {
            if (!Array.isArray(notes) || typeof notes[0] !== 'string') {
                throw new TypeError();
            }
            if (typeof callback !== 'function') {
                throw new TypeError();
            }
        }

        rate = rate ? range(rate, 0.5, 2.0) : 1.0;
        gain = gain ? range(gain, 0.0, 1.0) : 1.0;

        // TODO: check notes in backend, instead of sound handles here?

        let sounds = [];
        for (let note in notes) {
            let sound = this.sounds[note];
            if (!sound) {
                callback(null);
                console.error('Note not loaded', note);
                return;
            }
            sounds.push(sound);
        }

        let promise = SoundPool.playSync(sounds, 0, rate, gain);
        promise.then(streams => {
            callback(streams);
        });
        promise.catch(e => {
            callback(null);
            console.error('Failed to play notes', notes);
            console.debug(e);
        });
    }

    /**
     * Immediately stop provided streams.
     * @param {number[]} streams - see {playCallback}
     */
    stop(streams) {
        for (let stream of streams)
            SoundPool.stop(stream);
    }

    /**
     * @param {number[]} streams
     */
    pause(streams) {
        for (let stream of streams)
            SoundPool.pause(stream);
    }

    /**
     * @param {number[]} streams
     */
    resume(streams) {
        for (let stream of streams)
            SoundPool.resume(stream);
    }

    /**
     * Pause all playing sounds.
     */
    pauseAll() {
        SoundPool.autoPause();
    }

    /**
     * Resume all paused sounds.
     */
    resumeAll() {
        SoundPool.autoResume();
    }

    setGain(streams, gain) {
        // TODO: implement SoundPool.setGain
        //for (let stream of streams)
        //    SoundPool.setGain(stream, gain);
    }
}

module.exports = Instrument;
