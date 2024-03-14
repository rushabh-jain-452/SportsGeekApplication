import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, StatusBar, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
// import { useTheme } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TouchableOpacity } from "react-native-gesture-handler";
import { Card } from 'react-native-elements';
import axios from 'axios';

import * as Colors from '../config/Colors';
import { formatDate, getNumberFromDate } from '../helpers/dateFunctions';
import showSweetAlert from '../helpers/showSweetAlert';
import { baseurl, errorMessage } from '../config';
import { AuthContext } from '../../App';

const Tab = createMaterialTopTabNavigator();

const UpcomingMatches = ({ navigation }) => {
  const { loginState, logout } = useContext(AuthContext);
  const userId = loginState.userId;

  const headers = { 'Authorization': 'Bearer ' + loginState.token };

  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // console.log("User Id : "+userId);
    // fetchData();
  }, []);

  const fetchData = () => {
    // setLoading(true);
    axios.get(baseurl + '/users/' + userId + '/upcoming', { headers })
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        if (response.status == 200) {
          setData(response.data);
        } else {
          setData([]);
          showSweetAlert('error', 'Network Error', errorMessage);
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        showSweetAlert('error', 'Network Error', errorMessage);
        if (error.response && error.response.status === 401) {
          logout();
        }
      });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
      {loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
      {/* {!data && (<Text style={styles.heading}>Sorry, there are no upcoming matches.</Text>)} */}
      {(data && data.length < 1) && (<Text style={styles.heading}>You have not placed future bets on any upcoming matches.</Text>)}
      {
        data && data.map((item, index) => {
          const n = getNumberFromDate(item.startDatetime);
          const mystyle = n === 0 ? styles.bgColorEven : styles.bgColorOdd;
          return (
            <TouchableOpacity style={[styles.card, mystyle]} key={item.matchId} onPress={() => navigation.navigate('ContestScreen', { matchId: item.matchId })}>
              <View>
                <Text style={styles.date}>{formatDate(item.startDatetime)}</Text>
              </View>
              <View style={styles.teamsContainer}>
                <View style={styles.teamLeft}>
                  <Card.Image style={styles.ellipseLeft} source={{ uri: item.team1Logo }} />
                  <Text style={styles.teamNameLeft}>{item.team1Short}</Text>
                </View>
                <View style={styles.vsColumn}>
                  <Text style={styles.vs}>vs</Text>
                </View>
                <View style={styles.teamRight}>
                  <Text style={styles.teamNameRight}>{item.team2Short}</Text>
                  <Card.Image style={styles.ellipseRight} source={{ uri: item.team2Logo }} />
                </View>
              </View>
              <View>
                <Text style={styles.venue}>{item.venue}</Text>
              </View>
              <View style={styles.dividerStyle} ></View>
              <View>
                {/* <Text style={styles.bet}>Bet <Text style={styles.arrowStyle}>&#8594;</Text> {item.contestPoints} points on {item.teamName}</Text> */}
                <Text style={styles.bet}>My Bet --&gt; {item.contestPoints} points on {item.teamName}</Text>
              </View>
            </TouchableOpacity>
          );
        })
      }
      <View style={{ height: 100 }}></View>
    </ScrollView>
  );
}

const LiveMatches = ({ navigation }) => {
  const { loginState } = React.useContext(AuthContext);
  const userId = loginState.userId;

  const headers = { 'Authorization': 'Bearer ' + loginState.token };

  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // fetchData();
  }, []);

  const fetchData = () => {
    // console.log("U Id : " + userId);
    // setLoading(true);
    axios.get(baseurl + '/users/' + userId + '/live', { headers })
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        if (response.status == 200) {
          setData(response.data);
        } else {
          setData([]);
          showSweetAlert('error', 'Network Error', errorMessage);
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        showSweetAlert('error', 'Network Error', errorMessage);
        if (error.response && error.response.status === 401) {
          logout();
        }
      });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
      <StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
      {loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
      {(data && data.length < 1) && (<Text style={styles.heading}>There are no live matches going now.</Text>)}
      {
        data && data.map((item, index) => {
          const n = getNumberFromDate(item.startDatetime);
          const mystyle = n === 0 ? styles.bgColorEven : styles.bgColorOdd;
          return (
            <TouchableOpacity style={[styles.card, mystyle]} key={item.matchId} onPress={() => navigation.navigate('LiveMatchDetailsScreen', { matchId: item.matchId })}>
              <View>
                <Text style={styles.date}>{formatDate(item.startDatetime)}</Text>
              </View>
              <View style={styles.teamsContainer}>
                <View style={styles.teamLeft}>
                  <Card.Image style={styles.ellipseLeft} source={{ uri: item.team1Logo }} />
                  <Text style={styles.teamNameLeft}>{item.team1Short}</Text>
                </View>
                <View style={styles.vsColumn}>
                  <Text style={styles.vs}>vs</Text>
                </View>
                <View style={styles.teamRight}>
                  <Text style={styles.teamNameRight}>{item.team2Short}</Text>
                  <Card.Image style={styles.ellipseRight} source={{ uri: item.team2Logo }} />
                </View>
              </View>
              <View>
                <Text style={styles.venue}>{item.venue}</Text>
              </View>
              <View style={styles.dividerStyle} ></View>
              <View>
                {
                  item.teamName == 'NA' ?
                  <Text style={styles.bet}>My Bet --&gt; Not placed</Text> :
                  <Text style={styles.bet}>My Bet --&gt; {item.contestPoints} points on {item.teamName}</Text>
                }
              </View>
            </TouchableOpacity>
          );
        })
      }
      <View style={{ height: 100 }}></View>
    </ScrollView>
  );
}

const Results = ({ navigation }) => {
  const { loginState } = React.useContext(AuthContext);
  const userId = loginState.userId;

  const headers = { 'Authorization': 'Bearer ' + loginState.token };

  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResultData();
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // fetchResultData(userId);
  }, []);

  const fetchResultData = () => {
    // setLoading(true);
    // console.log("User Id : " + userId);
    axios.get(baseurl + '/users/' + userId + '/result', { headers })
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        if (response.status == 200) {
          setData(response.data);
        } else {
          setData([]);
          showSweetAlert('error', 'Network Error', errorMessage);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setRefreshing(false);
        showSweetAlert('error', 'Network Error', errorMessage);
        if (error.response && error.response.status === 401) {
          logout();
        }
      });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
      {loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
      {(data && data.length < 1) && (<Text style={styles.heading}>There are no results for old matches.</Text>)}
      {
        data && data.map((item, index) => {
          const n = getNumberFromDate(item.startDatetime);
          const mystyle = n === 0 ? styles.bgColorEven : styles.bgColorOdd;
          return (
            <TouchableOpacity style={[styles.card, styles.resultCard, mystyle]} key={item.matchId} onPress={() => navigation.navigate('ResultWithUsersScreen', { matchId: item.matchId })}>
              <View style={styles.winnerContainer}>
                {item.resultStatus == 1 && item.winnerTeamName &&
                  (<Text style={styles.winnerTeam}>Winner: {item.winnerTeamName}</Text>)
                }
                {item.resultStatus == 0 && (<Text style={styles.winnerTeam}>Match Draw</Text>)}
                {item.resultStatus == 2 && (<Text style={styles.winnerTeam}>Match Cancelled</Text>)}
                {/* Winning or Losing Points */}
                {
                  (item.resultStatus == 1 && item.winnerTeamName == item.teamName) &&
                  (<Text style={[styles.points, styles.winningPoints]}>Winning Points: {item.winningPoints}</Text>)
                }
                {
                  (item.resultStatus == 1 && item.winnerTeamName != item.teamName) &&
                  (<Text style={[styles.points, styles.losingPoints]}>Losing Points: {item.contestPoints}</Text>)
                }
              </View>
              <View style={styles.dividerStyle} ></View>
              <View>
                <Text style={styles.date}>{formatDate(item.startDatetime)}</Text>
              </View>
              <View style={styles.teamsContainer}>
                <View style={styles.teamLeft}>
                  <Card.Image style={styles.ellipseLeft} source={{ uri: item.team1Logo }} />
                  <Text style={styles.teamNameLeft}>{item.team1Short}</Text>
                </View>
                <View style={styles.vsColumn}>
                  <Text style={styles.vs}>vs</Text>
                </View>
                <View style={styles.teamRight}>
                  <Text style={styles.teamNameRight}>{item.team2Short}</Text>
                  <Card.Image style={styles.ellipseRight} source={{ uri: item.team2Logo }} />
                </View>
              </View>
              <View>
                <Text style={styles.venue}>{item.venue}</Text>
              </View>
              <View style={styles.dividerStyle} ></View>
              <View>
                {
                  item.teamName == 'NA' ?
                  <Text style={styles.bet}>My Bet --&gt; Points not available</Text> :
                  <Text style={styles.bet}>My Bet --&gt; {item.contestPoints} points on {item.teamName}</Text>
                }
              </View>
            </TouchableOpacity>
          );
        })
      }
      <View style={{ marginTop: 100 }}></View>
    </ScrollView>
  );
}

const MyMatchesScreen = () => {
  return (
    <Tab.Navigator initialRouteName="Live">
      <Tab.Screen name="Upcoming" component={UpcomingMatches} />
      <Tab.Screen name="Live" component={LiveMatches} />
      <Tab.Screen name="Results" component={Results} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "rgba(255,255,255,1)"
  },
  heading: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: "center",
    paddingTop: 5
  },
  // cardContainer: {
  //   width: '100%',
  //   display: 'flex',
  //   flexDirection: 'column',
  // },
  card: {
    width: '96%',
    // height: 160,
    borderWidth: 2,
    borderColor: '#19398A',
    borderRadius: 10,
    marginTop: 8,
    alignSelf: 'center'
  },
  resultCard: {
    // height: 192
  },
  bgColorOdd: {
    // backgroundColor: "#DFE7FD",
    backgroundColor: Colors.odd,
  },
  bgColorEven: {
    // backgroundColor: "#BDE0FE",
    backgroundColor: Colors.even,
  },
  winnerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 5,
    marginBottom: 5,
    // backgroundColor: 'red',
  },
  winnerTeam: {
    textAlign: 'left',
    fontSize: 16,
    paddingLeft: 10,
    fontWeight: 'bold',
    // backgroundColor: 'yellow',
  },
  points: {
    textAlign: 'right',
    fontSize: 16,
    paddingRight: 10,
    fontWeight: 'bold',
    // backgroundColor: 'green',
  },
  winningPoints: {
    color: Colors.green
  },
  losingPoints: {
    color: Colors.red
  },
  date: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    textAlign: "center",
    paddingTop: 4,
    fontWeight: 'bold'
  },
  teamsContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 3,
    marginLeft: 15,
    marginRight: 15,
  },
  teamLeft: {
    width: '45%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  teamRight: {
    width: '45%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  ellipseLeft: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  ellipseRight: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  teamNameLeft: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 22,
    marginLeft: 15,
    fontWeight: 'bold',
    textAlignVertical: 'center'
  },
  teamNameRight: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 22,
    marginRight: 15,
    fontWeight: 'bold',
    textAlignVertical: 'center'
  },
  vsColumn: {
    width: '10%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vs: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: 'center',
    fontSize: 22,
  },
  venue: {
    textAlign: 'center',
    fontSize: 16,
    paddingBottom: 5
  },
  bet: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    position: 'relative',
    bottom: 0,
    paddingTop: 5,
    paddingBottom: 5,
  },
  dividerStyle: {
    height: 2,
    // backgroundColor: '#000',
    backgroundColor: '#19398A'
  },
});

export default MyMatchesScreen;