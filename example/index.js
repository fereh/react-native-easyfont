import React from 'react';
import { AppRegistry, View, Text } from 'react-native';
import { name as appName } from './app.json';

import { instrument, player, generatePitchList, } from 'react-native-easyfont';

console.log(generatePitchList(3, 4));
let piano = instrument('acoustic_grand_piano');


const App = () => {
    return (
        <View>
            <Text>Easyfont Example</Text>
        </View>
    );
};

AppRegistry.registerComponent(appName, () => App);
