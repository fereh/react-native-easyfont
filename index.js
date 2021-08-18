import Instrument from './instrument';
import Player from './player';

/** Lists of possible notes and octaves for soundfonts. */
const getNotes = () => [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', ];
const getOctaves = () => [ 0, 1, 2, 3, 4, 5, 6, 7, ];

/** Generate list of notes in Scientific Pitch Notation, by octave. */
const generatePitchList = (...octaves) => {
    if (octaves.length === 0) {
        octaves = getOctaves();
    }
    octaves = [...new Set(octaves)]; // ensures no duplicates
    let res = [];
    for (let octave of octaves) {
        if (octave === 0) {
            // A0, Bb0 and B0 are the only 0-octave notes with samples
            res.push('A0', 'Bb0', 'B0');
        }
        else if (octave > 0 && octave < 8) {
            for (let note of getNotes()) {
                res.push(note + octave.toString());
            }
        }
    }
    return res;
};

// factory functions allow chaining
// TODO: look more into factory functions
const instrument = (name) => new Instrument(name);
const player = (instrument, options) => new Player(instrument, options);

module.exports = {
    instrument,
    player,
    generatePitchList,
    getNotes,
    getOctaves,
};

