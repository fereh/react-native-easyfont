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
import Easyfont from 'react-native-easyfont';

new Easyfont.Player('acoustic_grand_piano').prepare(Easyfont.generatePitchList(4))
    .then(player => {
        player.play([ 'c4', 'e4', 'g4', ]);
        player.play([ 'd4', 'f4', 'a4', ], 2000);
    });
```

### Lazy loading

```javascript
import { Player, generatePitchList } from 'react-native-easyfont';

const player = new Easyfont.Player('violin');
// TODO
```

## API
See the [API reference](API.md).
