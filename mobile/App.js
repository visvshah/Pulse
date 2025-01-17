// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from './SignInScreen'; // Your existing component
import LoggedInScreen from './LoggedInScreen'; // New component for logged in state
import ScrollScreen from './ScrollScreen'; 

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="LoggedIn" component={LoggedInScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="Scroll" component={ScrollScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
