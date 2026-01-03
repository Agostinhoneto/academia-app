import React from 'react';
import {StatusBar} from 'react-native';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import {AuthProvider} from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <ExpoStatusBar style="dark" />
      <AppNavigator />
    </AuthProvider>
  );
}

export default App;
