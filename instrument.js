const { NativeModules, } = require('react-native');
const { SoundPool, } = NativeModules;

/** Manages the loading, playing, releasing of related sound resources. */
class Instrument {

    /**
     * constructor - initialize an instrument
     * @param name {string} - an instrument name prefix as seen in resources
     *   e.g. 'acoustic_grand_piano_a0.mp3' -> 'acoustic_grand_piano'
     */
    constructor(name) {
        this.name = name;
        this.sounds = {};
        this.soundPromises = {};
        const maxStreams = 6;
        SoundPool.create(maxStreams);
    }

    release() {
        this.sounds = null;
        this.soundPromises = null;
        SoundPool.release();
    }


    /**
     * prepare - try to garentee that notes are ready for playback
     *   any notes that fail are returned in `failedNotes`
     * @param notes {string[]}
     * @param callback {function} - all `notes` are prepared
     *   @param failedNotes - `null` on success, or an array of failed notes
     */
    prepare(notes, callback) {
        if (__DEV__) {
            if (!Array.isArray(notes)) throw new TypeError('prepare(): notes must be array');
            if (typeof notes[0] !== 'string') throw new TypeError('prepare(): notes must contain strings');
        }

        let failedNotes = [];
        let progress = 0;
        const advance = () => {
            if (++progress === notes.length) {
                callback && callback(failedNotes.length === 0 ? null : failedNotes);
                console.debug('Finished preparing', notes);
            }
        };
        for (let note of notes) {
            note = note.toLowerCase();
            if (note in this.sounds) {
                advance();
                continue;
            }

            // Promises are used to eleminate the race of calling
            // prepare while sound is already loading, but not yet loaded
            let promise;
            if (note in this.sounds) {
                promise = this.sounds[note];
            }
            else {
                promise = SoundPool.load(`${this.name}_${note}`);
                this.soundPromises[note] = promise;
            }
            promise.then(sound => {
                //if (!this.sounds.hasOwnProperty(note)) {
                this.sounds[note] = sound;
                delete this.soundPromises[note];
                //}
            });
            promise.catch(e => {
                // failedNotes are never removed from soundPromises,
                // so that future calls immediately fail
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
     * play - play notes
     * @param notes {string[]} - notes to play
     *   if multiple supplied, will try to play in sync
     * @param speed {number} - the speed at which to play (0.5 - 2.0)
     * @param gain {number} - the gain (volume) at which to play (0.0 - 1.0)
     * @param callback {function} - notes are queued in the native layer for playback
     *   @param streams {number[]} - handles uses for playback control,
     *     or `null` if all notes couldn't be played
     */
    play(notes, speed, gain, callback) {
        if (__DEV__) {
            if (!Array.isArray(notes)) throw new TypeError('play(): notes must be array');
            if (typeof notes[0] !== 'string') throw new TypeError('play(): notes must contain strings');
            if (typeof speed !== 'number' || typeof gain !== 'number') throw new TypeError('play(): speed, gain must be numbers');
            const notInRange = (val, min, max) => {
                return (val < min || val > max);
            };
            if (notInRange(speed, 0.5, 2.0) || notInRange(gain, 0.0, 1.0)) {
                throw new RangeError();
            }
        }

        let sounds = notes.map(note => this.sounds[note.toLowerCase()]);
        let promise = SoundPool.playSync(sounds, 0, speed, gain);
        promise.then(callback);
        promise.catch(e => {
            callback(null);
            console.error('Failed to play', notes);
            console.debug(e);
        });
    }

    /**
     * stop - immediately stop playback of provided streams
     * @param streams {number[]} - streams to stop
     */
    stop(streams) {
        for (let stream of streams)
            SoundPool.stop(stream);
    }

    pause(streams) {
        for (let stream of streams)
            SoundPool.pause(stream);
    }

    resume(streams) {
        for (let stream of streams)
            SoundPool.resume(stream);
    }

    pauseAll() {
        SoundPool.autoPause();
    }
    resumeAll() {
        SoundPool.autoResume();
    }
}

module.exports = Instrument;
