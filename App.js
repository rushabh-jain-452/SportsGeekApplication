/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import type { Node } from 'react';
// import { ToastAndroid } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RootStack from './src/navigation/RootStack';
import HomeStack from './src/navigation/HomeStack';
// import MainTab from './src/navigation/MainTab';

//  const Drawer = createDrawerNavigator();
import showSweetAlert from './src/helpers/showSweetAlert';
import { baseurl, errorMessage } from './src/config';
export const AuthContext = React.createContext();

const App: () => Node = () => {
  // const [isLoading, setIsLoading] = React.useState(true);
  // const [userToken, setUserToken] = React.useState(null); 

  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  const initialLoginState = {
    userId: null,
    username: null,
    role: null,
    token: null,
    chatMessages: [],
    lastChatId: 0,
    lastLogId: 0,
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333'
    }
  }

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff'
    }
  }

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  // const loginReducer = (prevState, action) => {
  //   switch( action.type ) {
  //     case 'RETRIEVE_TOKEN': 
  //       return {
  //         ...prevState,
  //         userToken: action.token,
  //         isLoading: false,
  //       };
  //     case 'LOGIN': 
  //       return {
  //         ...prevState,
  //         userName: action.id,
  //         userToken: action.token,
  //         role: action.role,
  //         isLoading: false,
  //       };
  //     case 'LOGOUT': 
  //       return {
  //         ...prevState,
  //         userName: null,
  //         userToken: null,
  //         role: '',
  //         isLoading: false,
  //       };
  //     case 'REGISTER': 
  //       return {
  //         ...prevState,
  //         userName: action.id,
  //         userToken: action.token,
  //         isLoading: false,
  //       };
  //   }
  // };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          token: action.token,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userId: action.userId,
          username: action.username,
          role: action.role,
          token: action.token,
          chatMessages: []
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userId: null,
          username: null,
          role: null,
          token: null,
          chatMessages: []
        };
      case 'SET_CHAT_MESSAGES':
        return {
          ...prevState,
          chatMessages: action.chatMessages,
          lastChatId: action.lastChatId ? action.lastChatId : prevState.lastChatId,
          lastLogId: action.lastLogId ? action.lastLogId : prevState.lastLogId,
        };
      case 'ADD_CHAT_MESSAGES':
        return {
          ...prevState,
          chatMessages: prevState.chatMessages.concat(action.newMessages),
        };
      default:
        return prevState;
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    login: async (userId, username, role, token) => {
      try {
        // console.log('From SignIn : ' + userId + ' ' + username + ' ' + role + ' ' + token);
        await AsyncStorage.setItem('userId', userId + '');
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('role', role);
        await AsyncStorage.setItem('token', token);
      } catch (e) {
        console.log(e);
      }
      // console.log('Token from Signin : ', token);
      // dispatch({ type: 'LOGIN', id: userName, token: userToken, role: role });
      dispatch({ type: 'LOGIN', userId: userId, username: username, role: role, token: token });
    },
    logout: async () => {
      // setUserToken(null);
      // setIsLoading(false);
      try {
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('role');
        await AsyncStorage.removeItem('token');
      } catch (e) {
        // console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    toggleTheme: () => {
      setIsDarkTheme(isDarkTheme => !isDarkTheme);
    },
  }), []);

  // useEffect(() => {
  //   setTimeout(async() => {
  //     // setIsLoading(false);
  //     const token = null;
  //     try {
  //       token = await AsyncStorage.getItem('token');
  //     } catch(e) {
  //       console.log(e);
  //     }
  //     // console.log('user token: ', userToken);
  //     dispatch({ type: 'RETRIEVE_TOKEN', token: token });
  //   }, 1000);
  // }, []);

  useEffect(async () => {
    // dispatch({ type: 'RETRIEVE_TOKEN', token: token });
    const userId = await AsyncStorage.getItem('userId');
    const username = await AsyncStorage.getItem('username');
    const role = await AsyncStorage.getItem('role');
    const token = await AsyncStorage.getItem('token');
    dispatch({ type: 'LOGIN', userId: userId, username: username, role: role, token: token });
  }, []);

  // if( loginState.isLoading ) {
  //   return(
  //     <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
  //       <ActivityIndicator size="large"/>
  //     </View>
  //   );
  // }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthContext.Provider value={{ ...authContext, loginState: loginState, dispatch: dispatch }}>
          <NavigationContainer theme={theme}>
            {loginState.token !== null ? (
              <HomeStack />
            )
              :
              <RootStack />
            }
          </NavigationContainer>
        </AuthContext.Provider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
