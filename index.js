const Instrument = require('./instrument');
const Player = require('./player');

/** List of possible notes for soundfonts. */
getNotes = () => [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', ];

/** List of possible octaves for soundfonts. */
getOctaves = () => [ 0, 1, 2, 3, 4, 5, 6, 7, ];

/** Generate list of notes in Scientific Pitch Notation, by octave. */
generatePitchList = (...octaves) => {
    if (octaves.length === 0) {
        octaves = Easyfont.getOctaves();
    }
    octaves = [...new Set(octaves)]; // ensures no duplicates
    let res = [];
    for (let octave of octaves) {
        if (octave === 0) {
            // A0, Bb0 and B0 are the only 0-octave notes with samples
            res.push('A0', 'Bb0', 'B0');
        }
        else if (octave > 0 && octave < 8) {
            for (let note of Easyfont.getNotes()) {
                res.push(note + octave.toString());
            }
        }
    }
    return res;
};

/** Factory wrapper for {@link Instrument} */
instrument = (name) => new Instrument(name);

/** Factory wrapper for {@link Player} */
player = (instrument, options) => new Player(instrument, options);

module.exports = {
    instrument,
    player,
    generatePitchList,
    getNotes,
    getOctaves,
};
