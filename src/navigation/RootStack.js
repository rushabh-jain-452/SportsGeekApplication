import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';

const Stack = createStackNavigator();

const RootStack = ({ navigation }) => (
	<Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
		<Stack.Screen name="SplashScreen" component={SplashScreen} />
		<Stack.Screen name="SignInScreen" component={SignInScreen} />
		<Stack.Screen name="SignUpScreen" component={SignUpScreen} />
		<Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} />
	</Stack.Navigator>
);

export default RootStack;