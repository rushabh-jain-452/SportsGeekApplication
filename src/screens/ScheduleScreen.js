import React, { Component, useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, ScrollView, Alert, StatusBar, ActivityIndicator, RefreshControl } from "react-native";
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import { TouchableOpacity } from "react-native-gesture-handler";
// import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import { formatDate, calDateDiffDays, getNumberFromDate } from '../helpers/dateFunctions';
import showSweetAlert from '../helpers/showSweetAlert';
import { errorMessage } from '../config';
import * as Colors from '../config/Colors';
import { AuthContext } from '../../App';

const ScheduleScreen = ({ navigation }) => {
  const { loginState, logout } = useContext(AuthContext);
  let baseurl = loginState.backendUrl;

  const headers = { 'Authorization': 'Bearer ' + loginState.token };

  // const navigation = useNavigation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = React.useState(false);

  const noOfDaysFutureBets = 5;

  useEffect(() => {
    fetchData();
  }, [refreshing]);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   const interval = setInterval(, 10000);
  // });

  // const refreshData = () => {

  // }

  const fetchData = () => {
    axios.get(baseurl + '/matches/upcoming', { headers })
      .then((response) => {
        // console.log('Come in then...');
        // console.log(response.status);
        // console.log(response.data);
        setLoading(false);
        setRefreshing(false);
        if (response.status == 200) {
          const data = response.data;
          const filterData = data.filter((item) => item.winnerTeamId == 0 && item.resultStatus == 0);
          setData(filterData);
        }
        else {
          setData([]);
          showSweetAlert('error', 'Network Error', errorMessage);
          // console.log('Status : ' + response.status);
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        // const response = error.message;
        // console.log('Come in catch...');
        console.log(error);
        console.log(error.response);
        showSweetAlert('error', 'Network Error', errorMessage);
        if (error.response && error.response.status === 401) {
          logout();
        }
      });
  }

  const handleCardClick = (startDatetime, matchId, team1Short, team2Short) => {
    // Alert.alert(item.team1 + ' vs ' + item.team2);
    // Alert.alert(index.toString());
    const startDate = new Date(startDatetime);
    // console.log("Type : " + typeof(startTimestamp));
    // console.log("StartDatetime : " + startTimestamp);
    const currentDate = new Date();
    // console.log("Current Timestamp : " + dt.toLocaleString());
    // console.log(dt > startTimestamp);
    const diffDays = calDateDiffDays(new Date(), startDate);
    // console.log(startDatetime + ' ' +  diffDays);
    if (currentDate > startDate) {
      showSweetAlert('warning', 'Timeout', 'Sorry, Bets for this match has been closed.');
      fetchData();
    }
    else if (diffDays > noOfDaysFutureBets) {
      showSweetAlert('warning', 'Out of Schedule', 'Sorry, Bets for this match are not opened yet.');
    }
    else if (team1Short == 'TBC' || team2Short == 'TBC') {
      showSweetAlert('warning', 'Out of Schedule', 'Sorry, Bets for this match are not opened yet.');
    }
    else {
      // showSweetAlert('success', 'Success', 'You can play this match.');
      // props.setMatchId(matchId);      
      navigation.navigate('ContestScreen', { matchId: matchId });
    }
  }

  // const handlePlayerDetailClick = (teamId) => {
  //   navigation.navigate('PlayerDetailofTeam', { playerTeamId: teamId });
  // }

  const onRefresh = React.useCallback(() => {
    // console.log('After refresh : ');
    setRefreshing(true);
    // fetchData();
    // wait(2000).then(() => setRefreshing(false));
  }, []);

  // let lastNumber = 0;
  // let lastDate = '';
  // const getNumberFromDate = (str) =>{
  //   try{
  //     // console.log(str);
  //     // 2021-08-23T19:30:00.000+00:00
  //     if(lastDate === ''){
  //       lastDate = str;
  //       const day = parseInt(str.substring(8,10));
  //       lastNumber = day % 2;
  //       return lastNumber;
  //     }else{
  //       const oldDate = lastDate.substring(0, 10);
  //       const newDate = str.substring(0, 10);
  //       lastDate = str;
  //       if(oldDate === newDate){
  //         return lastNumber;
  //       }
  //       else{
  //         // Generate number
  //         // let day = str.substring(8,10);
  //         // let oldMonth = parseInt(lastDate.substring(5, 7));
  //         // let newMonth = parseInt(str.substring(5,7));
  //         lastNumber = (lastNumber + 1) % 2;
  //         return lastNumber;
  //       }
  //     }
  //   }
  //   catch(err){
  //     return 0;
  //   }
  // };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
      <Text style={styles.heading}>{(data && data.length < 1) && 'No '}Upcoming Matches</Text>
      {loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
      <View style={styles.cardContainer}>
        {
          data && data.map((item, index) => {
            const n = getNumberFromDate(item.startDatetime);
            const mystyle = n === 0 ? styles.bgColorEven : styles.bgColorOdd;
            return (
              <TouchableOpacity style={[styles.card, mystyle]} key={item.matchId} onPress={() => { handleCardClick(item.startDatetime, item.matchId, item.team1Short, item.team2Short) }}>
                <View>
                  <Text style={styles.date}>{formatDate(item.startDatetime)}</Text>
                </View>
                <View style={styles.teamsContainer}>
                  {/* <TouchableOpacity onPress={() => { handlePlayerDetailClick(item.team1Id) }}> */}
                  <View style={styles.teamLeft}>
                    <Card.Image style={styles.ellipseLeft} source={{ uri: item.team1Logo }} />
                    <Text style={styles.teamNameLeft}>{item.team1Short}</Text>
                  </View>
                  {/* </TouchableOpacity> */}
                  <View style={styles.vsColumn}>
                    <Text style={styles.vs}>vs</Text>
                  </View>
                  {/* <TouchableOpacity onPress={() => { handlePlayerDetailClick(item.team2Id) }}> */}
                  <View style={styles.teamRight}>
                    <Text style={styles.teamNameRight}>{item.team2Short}</Text>
                    <Card.Image style={styles.ellipseRight} source={{ uri: item.team2Logo }} />
                  </View>
                  {/* </TouchableOpacity> */}
                </View>
                <View>
                  <Text style={styles.venue}>{item.venue}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        }
      </View>
      <View style={{ height: 15 }}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "rgba(255,255,255,1)",
  },
  heading: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: "center",
    paddingTop: 5
  },
  cardContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center'
    // justifyContent: 'center'
  },
  card: {
    width: '96%',
    // height: 125,
    // backgroundColor: "#E6E6E6",
    // backgroundColor: "#E8E8E4",
    borderWidth: 2,
    // borderColor: "#000000",
    // borderColor: "#c1c1c1",
    borderColor: '#19398A',
    borderRadius: 10,
    marginTop: 8,
    alignSelf: 'center'
  },
  bgColorOdd: {
    // backgroundColor: "#E6E6E6",
    // backgroundColor: "#BCD4E6",
    // backgroundColor: "#99C1DE",
    // backgroundColor: "#CAF0F8", // good
    // backgroundColor: "#DFE7FD",
    backgroundColor: Colors.odd,
  },
  bgColorEven: {
    // backgroundColor: "#E8E8E4",
    // backgroundColor: "#D8E2DC",
    // backgroundColor: "#BDE0FE",
    backgroundColor: Colors.even,
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
    // justifyContent: 'space-between',
    // backgroundColor: 'purple',
    marginTop: 5,
    marginBottom: 3,
    marginLeft: 15,
    marginRight: 15,
  },
  teamLeft: {
    width: '45%',
    // height: 95,
    // marginLeft: 15,
    display: 'flex',
    flexDirection: 'row',
    // alignContent: 'flex-end',
    justifyContent: 'flex-start',
    // alignSelf: "flex-start"
    // flex: 4,
    // backgroundColor: 'pink'
  },
  teamRight: {
    width: '45%',
    // marginRight: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // backgroundColor: 'green'
  },
  ellipseLeft: {
    width: 60,
    height: 60,
    // marginRight: 15,
    borderRadius: 30,
  },
  ellipseRight: {
    width: 60,
    height: 60,
    // marginLeft: 15,
    borderRadius: 30
  },
  teamNameLeft: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 22,
    marginLeft: 15,
    // marginTop: 20,
    fontWeight: 'bold',
    textAlignVertical: 'center'
  },
  teamNameRight: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 22,
    marginRight: 15,
    // marginTop: 20,
    fontWeight: 'bold',
    textAlignVertical: 'center'
  },
  vsColumn: {
    // width: 95,
    // marginLeft: 15,
    width: '10%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // height: 150,
    // marginTop: 10,
    // textAlign: "center",
    // alignSelf: "center"
    // flex: 2,
    // backgroundColor: 'red'
  },
  vs: {
    fontFamily: "roboto-regular",
    color: "#121212",
    // marginTop: 22,
    // marginLeft: 33,
    textAlign: 'center',
    // fontSize: 20,
    fontSize: 22,
    // backgroundColor: 'gray'
  },
  venue: {
    textAlign: 'center',
    fontSize: 16,
    position: 'relative',
    bottom: 0,
  },

  // time: {
  //   fontFamily: "roboto-regular",
  //   color: "#121212",
  //   fontSize: 16,
  //   marginTop: 18,
  //   marginLeft: 13
  // },
  // rect1: {
  //   width: 407,
  //   height: 142,
  //   backgroundColor: "#E6E6E6",
  //   borderWidth: 1,
  //   borderColor: "#000000",
  //   borderRadius: 10,
  //   marginTop: 12,
  //   marginLeft: 10
  // },
  // ellipse2: {
  //   width: 61,
  //   height: 61,
  //   marginTop: 15,
  //   borderRadius: 30
  // },
  // mI3: {
  //   fontFamily: "roboto-regular",
  //   color: "#121212",
  //   fontSize: 18,
  //   marginLeft: 11,
  //   marginTop: 37,
  //   fontWeight: "bold"
  // },
  // loremIpsum3: {
  //   fontFamily: "roboto-regular",
  //   color: "#121212",
  //   fontSize: 16
  // },
  // vs1: {
  //   fontFamily: "roboto-regular",
  //   color: "#121212",
  //   marginTop: 22,
  //   marginLeft: 33
  // },
  // loremIpsum4: {
  //   fontFamily: "roboto-regular",
  //   color: "#121212",
  //   fontSize: 16,
  //   marginTop: 18,
  //   marginLeft: 19
  // },
  // loremIpsum3Column: {
  //   width: 95,
  //   marginLeft: 23
  // },
  // eng1: {
  //   fontFamily: "roboto-regular",
  //   color: "#121212",
  //   fontSize: 18,
  //   marginLeft: 20,
  //   marginTop: 37,
  //   fontWeight: "bold"
  // },
  // ellipse3: {
  //   width: 61,
  //   height: 61,
  //   marginLeft: 18,
  //   marginTop: 17,
  //   borderRadius: 30
  // },
  // ellipse2Row: {
  //   height: 95,
  //   flexDirection: "row",
  //   marginTop: 26,
  //   marginLeft: 10,
  //   marginRight: 10
  // },
  // iplSchedule2021: {
  //   fontFamily: "roboto-regular",
  //   color: "rgba(00,00,00,1)",
  //   fontSize: 24,
  //   textAlign: "center",
  //   marginTop: -336,
  // },
  // container2: {
  //   flex: 1,
  //   justifyContent: "center"
  // },
  // horizontal: {
  //   flexDirection: "row",
  //   justifyContent: "space-around",
  //   padding: 10
  // },

});

export default ScheduleScreen;
