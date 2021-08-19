# react-native-easyfont

This fork of [react-native-soundfont](https://github.com/shavashav/react-native-soundfont).
It impliments it's own backend that allows for more control over playtime latency.

Latency is reduced by using Android's SoundPool as a backend,
which preloads sounds rather than streaming them.

Because preloading entire sounds takes longer than streaming,
support for lazy loading was added via the [`prepare()`](API.md) method.

**This module supports Android only.**

## Getting started

Add this line to your `package.json` dependencies:

`"react-native-easyfont": "git+https://gitlab.com/fereh/react-native-easyfont.git"`

then

`$ npm install`

You will have to recompile your React Native project, because this module contains native code:

`$ npx react-native run-android`

## Usage

### Hello World

```javascript
import { player, generatePitchList, } from 'react-native-easyfont';

player('acoustic_grand_piano').prepare(generatePitchList(5, 6)).then(player => {
    player.play([ 'c5', 'e5', 'g5', ]);
    player.play([ 'c5', 'f5', 'a5', ], 1000);
    player.play([ 'd5', 'f5', 'b5', ], 2000);
    player.play([ 'c5', 'g5', 'c6', ], 2500);
});
```

### Lazy loading

```javascript
import { player, } from 'react-native-easyfont';

const violinPlayer = player('violin');

// Whenever the notes are known:
const violinReady = violinPlayer.prepare(notes);

// Whenever the notes are to be played:
violinReady.then(() => {
    violinPlayer.stop(); // stop player playback
    violinPlayer.play(notes[0]);
    violinPlayer.play([ notes[1], notes[2], ], 3000);
    violinPlayer.play(notes[3], 3500);
}); 
```

## API
See the [API reference](API.md).
