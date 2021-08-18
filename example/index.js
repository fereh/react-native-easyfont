import React from 'react';
import { AppRegistry, Text, TouchableOpacity, View, } from 'react-native';
import { name as appName } from './app.json';

import { player, generatePitchList, } from 'react-native-easyfont';
const pp = player('acoustic_grand_piano', { duration: 1000, });
const notes = [ 'c5','d5','e5','f5','g5','a5','b5','c6'];
pp.prepare(notes);

const App = () => {

    const onPress = () => {
        pp.prepare(notes).then(() => {
            //pp.stop();
            pp.play([ 'c5', 'e5', 'g5', ]);
            pp.play([ 'c5', 'f5', 'a5', ], 1000);
            pp.play([ 'd5', 'f5', 'b5', ], 2000);
            pp.play([ 'c5', 'g5', 'c6', ], 3000);
        });
    };

    return (
        <View>
            <TouchableOpacity onPress={onPress}>
                <Text>PLAY SOME COOL TUNES</Text>
                <Text>PLAY SOME COOL TUNES</Text>
                <Text>PLAY SOME COOL TUNES</Text>
            </TouchableOpacity>
        </View>
    );
};

AppRegistry.registerComponent(appName, () => App);
