import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, ToastAndroid } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { Avatar } from "react-native-elements";
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';

import showSweetAlert from '../helpers/showSweetAlert';
import { errorMessage } from '../config';
import getColor from '../helpers/getColor';
import { convertUTCDateToLocalDate } from '../helpers/dateFunctions';

import HomeScreen from '../screens/HomeScreen';
import LeaderBoardScreen from '../screens/LeaderBoardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyMatchesScreen from '../screens/MyMatchesScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
// import RootStack from '../screens/RootStack';
import AdminScreen from '../screens/AdminScreen';
import PlayerDetailofTeam from '../screens/PlayerDetailofTeam';
import ChatScreen from '../screens/ChatScreen';

import { AuthContext } from '../../App';

const Tab = createMaterialBottomTabNavigator();
const HomeStack = createStackNavigator();
const AdminStack = createStackNavigator();
const FantasyStack = createStackNavigator();
const ChatStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const LeaderStack = createStackNavigator();
const MyMatchesStack = createStackNavigator();

const MainTab = () => {
  const { loginState, logout } = useContext(AuthContext);
  const role = loginState.role;
  
  const [badge, setBadge] = useState(0);

  const changeBadge = (badge) => {
    setBadge(badge);
  }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
    >
      {/* {
        role == 'Admin' &&
        (<Tab.Screen
          name="Admin Panel"
          component={AdminStackScreen}
          options={{
            tabBarLabel: 'Admin Panel',
            tabBarColor: '#19398A',
            tabBarIcon: ({ color }) => (
              <Icon name="ios-home" color={color} size={26} />
            ),
          }}
        />)
      } */}
      { (role == 'Admin') ?
        (<Tab.Screen
          name="Admin Panel"
          component={AdminStackScreen}
          options={{
            tabBarLabel: 'Admin Panel',
            tabBarColor: '#19398A',
            tabBarIcon: ({ color }) => (
              <Icon name="ios-home" color={color} size={26} />
            ),
          }}
        />) :
        (<Tab.Screen
          name="Home"
          component={HomeStackScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarColor: '#19398A',
            tabBarIcon: ({ color }) => (
              <Icon name="ios-home" color={color} size={26} />
            ),
          }}
        />)
      }
      <Tab.Screen
        name="Fantasy"
        component={FantasyStackScreen}
        options={{
          tabBarLabel: 'Fantasy',
          tabBarColor: '#19398A',
          tabBarIcon: ({ color }) => (
            <Icon name="game-controller" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="My Matches"
        component={MyMatchesStackScreen}
        options={{
          tabBarLabel: 'Matches',
          tabBarColor: '#19398A',
          tabBarIcon: ({ color }) => (
            // <Icon name="apps" color={color} size={26} />
            // <Icon name="grid" color={color} size={26} />
            <Icon name="stats-chart-outline" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="LeaderBoard"
        component={LeaderStackScreen}
        options={{
          tabBarLabel: 'LeaderBoard',
          tabBarColor: '#19398A',
          tabBarIcon: ({ color }) => (
            <Icon name="trophy" color={color} size={26} />
            // <Icon name="stats-chart-outline" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStackScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarColor: '#19398A',
          tabBarBadge: badge === 0 ? false : badge,
          tabBarIcon: ({ color }) => (
            <Icon name="chatbubbles" color={color} size={26} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="My Account"
        component={ProfileStackScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarColor: '#19398A',
          tabBarIcon: ({ color }) => (
            <Icon name="person-circle" color={color} size={26} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  )
};
export default MainTab;


const HomeStackScreen = ({ navigation }) => (
  <HomeStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#19398A',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <HomeStack.Screen name="Home" component={HomeScreen} options={{
      title: 'SportsGeek',
      headerLeft: () => (
        <UserAvatar onPress={() => navigation.navigate('ProfileScreen')} />
      )
    }} />
  </HomeStack.Navigator>
);

const AdminStackScreen = ({ navigation }) => (
  <AdminStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#19398A',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <AdminStack.Screen name="Home" component={AdminScreen} options={{
      title: 'SportsGeek Admin Panel',
      headerLeft: () => (
        <UserAvatar onPress={() => navigation.navigate('ProfileScreen')} />
      )
    }} />
  </AdminStack.Navigator>
);

const FantasyStackScreen = ({ navigation }) => (
  <FantasyStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#19398A',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <FantasyStack.Screen name="Fantasy" component={ScheduleScreen} options={{
      title: 'Fantasy',
      headerLeft: () => (
        <UserAvatar onPress={() => navigation.navigate('ProfileScreen')} />
      ),
      headerRight: () => (
        <Icon.Button name="information-circle-outline" size={30} iconStyle={{ marginRight: 0 }} backgroundColor="#19398A" onPress={() => navigation.navigate('HelpScreen')}></Icon.Button>
      )
    }} />
  </FantasyStack.Navigator>
);

const ChatStackScreen = ({ navigation }) => {

  const { loginState, dispatch } = React.useContext(AuthContext);
  let baseurl = loginState.backendUrl;

  const refreshChatMessages = () => {
    ToastAndroid.show('Fetching new messages...', ToastAndroid.SHORT);
    // console.log('Refreshing Chats...');
    // console.log('Token : ' + loginState.token);
    // console.log('lastChatId : ' + loginState.lastChatId);
    // console.log('lastLogId : ' + loginState.lastLogId);
    if (loginState.token) {
      const headers = { 'Authorization': 'Bearer ' + loginState.token };
      // setLoading(true);
      let lastChatId = loginState.lastChatId;
      // console.log(baseurl + '/public-chat/formatted/after-id/' + lastChatId);
      // console.log(loginState.lastLogId);
      axios.get(baseurl + '/public-chat/formatted/after-id/' + lastChatId, { headers })
        .then((response) => {
          // setLoading(false);
          if (response.status == 200) {
            const newChatData = response.data;
            if (newChatData.length > 0) {
              // setLastId(newChatData[0]._id);
              lastChatId = newChatData[0]._id;
              // Required for Live AWS Database
              // newChatData.forEach((item) => item.createdAt = convertUTCDateToLocalDate(new Date(item.createdAt)));
              // setMessages(data => [...newChatData, ...data]);
              // setMessages(data => newChatData.concat( data.filter(value => typeof(value._id) === 'number')) );
            }
            // Refresh Contest Log Code here...
            let lastLogId = loginState.lastLogId;
            // console.log(lastLogId);
            axios.get(baseurl + '/contest-log/formatted/after-id/' + lastLogId, { headers })
              .then((response) => {
                const newLogData = response.data;
                if (newLogData.length > 0) {
                  lastLogId = newLogData[0]._id.substr(1);
                }
                const newData = newChatData.concat(newLogData);
                if (newData.length > 0) {
                  // {"_id": "7dc621da-60ba-4930-a44e-48fc083c061f", "createdAt": 2021-09-12T10:50:31.302Z, "text": "hey", "user": {"_id": 16}}
                  // Remove messages with auto-generated IDs
                  let oldData = loginState.chatMessages;
                  oldData.filter(value => typeof (value._id) == 'number' || value._id.length < 30);
                  // console.log('oldData : ');
                  // console.log(oldData.length);
                  newData.sort((a, b) => {
                    const val1 = new Date(a.createdAt);
                    const val2 = new Date(b.createdAt);
                    if (val1 < val2) {
                      return 1;
                    }
                    if (val1 > val2) {
                      return -1;
                    }
                    return 0;
                  });
                  newData.forEach((item) => item.createdAt = convertUTCDateToLocalDate(new Date(item.createdAt)));
                  // console.log('newData : ');
                  // console.log(newData);
                  dispatch({ type: 'SET_CHAT_MESSAGES', chatMessages: GiftedChat.append(oldData, newData), lastChatId: lastChatId, lastLogId: lastLogId });
                  ToastAndroid.show(newData.length + ' new message' + (newData.length > 1 ? 's' : '') + ' fetched successfully', ToastAndroid.SHORT);
                } else {
                  ToastAndroid.show('No new messages found', ToastAndroid.SHORT);
                }
              })
              .catch((error) => {
                // console.log('inner catch');
                // console.log('Inner Error');
                // console.log(error);
                // console.log(error.response);
                // showSweetAlert('error', 'Network Error', errorMessage);
                if (error.response && error.response.status === 401) {
                  logout();
                }
              });
          } else {
            showSweetAlert('warning', 'Unable to fetch data!', 'Unable to fetch new messages.');
          }
        })
        .catch((error) => {
          // setLoading(false);
          // console.log('Outer Error');
          // console.log(error);
          // console.log(error.response);
          // showSweetAlert('error', 'Network Error', errorMessage);
          if (error.response && error.response.status === 401) {
            logout();
          }
        });
    } 
    // else {
    //   console.log('Token is null');
    //   // showSweetAlert('error', 'Network Error', errorMessage);
    // }
  };

  return (
    <ChatStack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#19398A',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }}>
      <ChatStack.Screen name="Chat" component={ChatScreen} options={{
        title: 'Chat',
        headerLeft: () => (
          <UserAvatar onPress={() => navigation.navigate('ProfileScreen')} />
        ),
        headerRight: () => (
          <Icon.Button name="refresh-circle-outline" size={30} iconStyle={{ marginRight: 0 }} backgroundColor="#19398A" onPress={refreshChatMessages}></Icon.Button>
        )
      }} />
    </ChatStack.Navigator>
  );
};

const LeaderStackScreen = ({ navigation }) => (
  <LeaderStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#19398A',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <LeaderStack.Screen name="LeaderBoard" component={LeaderBoardScreen} options={{
      title: 'LeaderBoard',
      headerLeft: () => (
        <UserAvatar onPress={() => navigation.navigate('ProfileScreen')} />
      )
    }} />
  </LeaderStack.Navigator>
);

const MyMatchesStackScreen = ({ navigation }) => (
  <MyMatchesStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: '#19398A',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    <MyMatchesStack.Screen name="My Matches" component={MyMatchesScreen} options={{
      title: 'My Matches',
      headerLeft: () => (
        <UserAvatar onPress={() => navigation.navigate('ProfileScreen')} />
      )
    }} />
  </MyMatchesStack.Navigator>
);

// const ProfileStackScreen = ({ navigation }) => (
//   <ProfileStack.Navigator screenOptions={{
//     headerStyle: {
//       backgroundColor: '#19398A',
//     },
//     headerTintColor: '#fff',
//     headerTitleStyle: {
//       fontWeight: 'bold'
//     }
//   }}>
//     <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{
//       title: 'Profile'
//     }} />
//   </ProfileStack.Navigator>
// );

const UserAvatar = (props) => {
  const { loginState } = React.useContext(AuthContext);
  let baseurl = loginState.backendUrl;
  const token = loginState.token;
  const userId = loginState.userId;

  const [avatarPath, setAvatarPath] = useState('');
  const [shortName, setShortName] = useState('');

  useEffect(() => {
    if (userId && token) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = () => {
    const headers = { 'Authorization': 'Bearer ' + token };
    // console.log(baseurl + '/users/' + userId);
    axios.get(baseurl + '/users/' + userId, { headers })
      .then((response) => {
        if (response.status == 200) {
          // console.log(response.data);
          if (response.data) {
            setAvatarPath(response.data.profilePicture);
            setShortName(response.data.firstName.substr(0, 1) + response.data.lastName.substr(0, 1));
          }
        }
      })
      .catch((error) => {
        // console.log(error);
        // console.log(error.response);
        // showSweetAlert('error', 'Network Error', errorMessage);
        if (error.response && error.response.status === 401) {
          logout();
        }
      });
  }

  return (
    avatarPath != '' ?
      (<Avatar
        {...props}
        size="small"
        rounded
        source={{
          uri: avatarPath
        }}
        containerStyle={{ marginLeft: 10 }}
      />) :
      shortName != '' ?
        (<Avatar
          {...props}
          size="small"
          rounded
          title={shortName}
          containerStyle={{ marginLeft: 10, backgroundColor: getColor(shortName) }}
        />) :
        <Icon.Button {...props} name="person-circle" size={43} iconStyle={{ marginRight: 0 }} backgroundColor="#19398A"></Icon.Button>
  );
}