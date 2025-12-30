import React from 'react';
import {StatusBar} from 'react-native';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <>
      <ExpoStatusBar style="dark" />
      <AppNavigator />
    </>
  );
}

export default App;
