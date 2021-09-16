import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, RefreshControl, ActivityIndicator, TouchableOpacity, ScrollView, StatusBar } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
// import { Avatar } from 'react-native-paper';
import { Avatar } from "react-native-elements";
import { Card } from 'react-native-elements';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

import { formatDate, getNumberFromDate } from '../helpers/dateFunctions';
import getColor from '../helpers/getColor';
import showSweetAlert from '../helpers/showSweetAlert';
import * as Colors from '../config/Colors';
import { baseurl, errorMessage } from '../config';

import { AuthContext } from '../../App';

const ResultWithUsersScreen = (props) => {
  const { loginState, logout } = useContext(AuthContext);
  const username = loginState.username;

  const headers = { 'Authorization': 'Bearer ' + loginState.token };

  const { matchId } = props.route.params;

  const navigation = useNavigation();

  const [matchData, setMatchData] = useState(null);
  const [data, setData] = useState(null);
  const [winnerTeam, setWinnerTeam] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);

  const [team1BetPoints, setTeam1BetPoints] = useState(0);
  const [team2BetPoints, setTeam2BetPoints] = useState(0);

  const [team1NoOfBets, setTeam1NoOfBets] = useState(0);
  const [team2NoOfBets, setTeam2NoOfBets] = useState(0);

  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState(1);  // 1 = ASC and -1 = DESC

  useEffect(() => {
    fetchMatchData();
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  const fetchMatchData = () => {
    axios.get(baseurl + '/matches/' + matchId, { headers })
      .then((response) => {
        if (response.status == 200) {
          setMatchData(response.data);
          const matchData = response.data;
          if (matchData.winnerTeamId == matchData.team1Id)
            setWinnerTeam(matchData.team1Short);
          else if (matchData.winnerTeamId == matchData.team2Id)
            setWinnerTeam(matchData.team2Short);
          fetchData(matchData);
        } else {
          setMatchData([]);
        }
      })
      .catch((error) => {
        setMatchData([]);
        showSweetAlert('error', 'Network Error', errorMessage);
        if (error.response && error.response.status === 401) {
          logout();
        }
      });
  }

  const fetchData = (matchData) => {
    axios.get(baseurl + '/matches/' + matchId + '/contest', { headers })
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        if (response.status == 200) {
          setData(response.data);
          const records = response.data;
          let team1points = 0, team2points = 0;
          let team1bets = 0, team2bets = 0;
          records.forEach((item, index) => {
            if (item.teamShortName == matchData.team1Short) {
              team1bets++;
              team1points += item.contestPoints;
            } else if (item.teamShortName == matchData.team2Short) {
              team2bets++;
              team2points += item.contestPoints;
            }
          });
          setTeam1BetPoints(team1points);
          setTeam2BetPoints(team2points);
          setTeam1NoOfBets(team1bets);
          setTeam2NoOfBets(team2bets);
        } else {
          console.log(error);
          setData([]);
          showSweetAlert('error', 'Network Error', errorMessage);
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        console.log(error);
        showSweetAlert('error', 'Network Error', errorMessage);
        if (error.response && error.response.status === 401) {
          logout();
        }
      });
  }

  const sort = (column) => {
    let order = sortOrder;
    if (sortColumn === column) {
      order = order * -1;
      setSortOrder(order);
    } else {
      order = 1;
      setSortOrder(1);
    }
    setSortColumn(column);
    switch (column) {
      case 'name':
        setData((oldData) => {
          const newData = [...oldData];
          newData.sort((a, b) => {
            const val1 = a.firstName.toLowerCase() + ' ' + a.lastName.toLowerCase();
            const val2 = b.firstName.toLowerCase() + ' ' + b.lastName.toLowerCase();
            if (val1 < val2) {
              return order * -1;
            }
            if (val1 > val2) {
              return order * 1;
            }
            return 0;
          });
          return newData;
        });
        break;
      case 'team':
        setData((oldData) => {
          const newData = [...oldData];
          newData.sort((a, b) => {
            const val1 = a.teamShortName.toLowerCase();
            const val2 = b.teamShortName.toLowerCase();
            if (val1 < val2) {
              return order * -1;
            }
            if (val1 > val2) {
              return order * 1;
            }
            return 0;
          });
          return newData;
        });
        break;
      case 'bet':
        setData((oldData) => {
          const newData = [...oldData];
          newData.sort((a, b) => (a.contestPoints - b.contestPoints) * order);
          return newData;
        });
        break;
      case 'win':
        setData((oldData) => {
          const newData = [...oldData];
          newData.sort((a, b) => (a.winningPoints - b.winningPoints) * order);
          return newData;
        });
        break;
    }
  };

  const n = matchData ? getNumberFromDate(matchData.startDatetime) : 0;
  const cardStyle = n === 0 ? styles.bgColorEven : styles.bgColorOdd;

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#19398A" size={40} style={{ marginLeft: 20, marginTop: 10, width: 100 }} /></TouchableOpacity>
      <StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
      {loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
      {
        matchData &&
        <View style={[styles.card, cardStyle]}>
          <View>
            {matchData.resultStatus == 1 &&
              (<Text style={styles.winnerTeam}>Winner: {winnerTeam}</Text>)
            }
            {matchData.resultStatus == 0 && (<Text style={styles.winnerTeam}>Match Draw</Text>)}
            {matchData.resultStatus == 2 && (<Text style={styles.winnerTeam}>Match Cancelled</Text>)}
          </View>
          <View style={styles.dividerStyle} ></View>
          <View>
            <Text style={styles.date}>{formatDate(matchData.startDatetime)}</Text>
          </View>
          <View style={styles.teamsContainer}>
            <View style={styles.teamLeft}>
              <Card.Image style={styles.ellipseLeft} source={{ uri: matchData.team1Logo }} />
              <Text style={styles.teamNameLeft}>{matchData.team1Short}</Text>
            </View>
            <View style={styles.vsColumn}>
              <Text style={styles.vs}>vs</Text>
            </View>
            <View style={styles.teamRight}>
              <Text style={styles.teamNameRight}>{matchData.team2Short}</Text>
              <Card.Image style={styles.ellipseRight} source={{ uri: matchData.team2Logo }} />
            </View>
          </View>
          {/* <View>
          <Text style={styles.venue}>{matchData.venue}</Text>
        </View> */}
          <View style={styles.dividerStyle} ></View>
          <View style={styles.pointsContainer}>
            <Text style={[styles.pointsStyle, styles.team1points]}>{team1BetPoints} ({team1NoOfBets} {team1NoOfBets > 1 ? 'Bets' : 'Bet'})</Text>
            <Text style={[styles.pointsStyle, styles.team2points]}>{team2BetPoints} ({team2NoOfBets} {team2NoOfBets > 1 ? 'Bets' : 'Bet'})</Text>
          </View>
        </View>
      }
      {/* End of Card */}
      <View style={styles.boxContainer}>
        <Text style={styles.heading}>Bets for this Match {(data && data.length > 0) && <>({data.length} {data.length > 1 ? 'Bets' : 'Bet'})</>}</Text>
      </View>
      <View style={styles.listContainer}>
        <View style={styles.headingRow}>
          <TouchableOpacity
            onPress={() => { sort('name') }}
            style={[styles.headingCol, styles.headingCol1]}>
            <Text style={styles.headingColText}>Name</Text>
            <FontAwesome name="sort" color="#000" size={15} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { sort('team') }}
            style={[styles.headingCol, styles.headingCol2]}>
            <Text style={styles.headingColText}>Team</Text>
            <FontAwesome name="sort" color="#000" size={15} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { sort('bet') }}
            style={[styles.headingCol, styles.headingCol3]}>
            <Text style={styles.headingColText}>Bet</Text>
            <FontAwesome name="sort" color="#000" size={15} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { sort('win') }}
            style={[styles.headingCol, styles.headingCol4]}>
            <Text style={styles.headingColText}>Win</Text>
            <FontAwesome name="sort" color="#000" size={15} />
          </TouchableOpacity>
        </View>
        {data && data.length == 0 && (<Text style={styles.msgStyle}>No users had placed bet on this match.</Text>)}
        {
          data && data.length > 0 && data.map((item, index) => {
            const mystyle = item.username == username ? styles.bgDark : styles.bgLight;
            return (
              <View style={[styles.listItem, mystyle]} key={item.contestId}>
                {
                  item.profilePicture != '' ?
                    (<Avatar
                      size="small"
                      rounded
                      source={{
                        uri: item.profilePicture
                      }}
                      containerStyle={{ marginLeft: 5 }}
                    />) :
                    (<Avatar
                      size="small"
                      rounded
                      title={item.firstName.substr(0, 1) + item.lastName.substr(0, 1)}
                      containerStyle={{ marginLeft: 5, backgroundColor: getColor(item.firstName) }}
                    />)
                }
                <Text style={[styles.cardItem, styles.name]}>{item.firstName + ' ' + item.lastName}</Text>
                <Text style={[styles.cardItem, styles.teamShortName]}>{item.teamShortName}</Text>
                <Text style={[styles.cardItem, styles.bet]}>{item.contestPoints}</Text>
                <Text style={[styles.cardItem, styles.win]}>{item.winningPoints}</Text>
              </View>
            );
          })
        }
      </View>
      <View style={{ marginTop: 50 }}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Card Styles
  container: {
    display: 'flex',
    flex: 1,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "rgba(255,255,255,1)"
  },
  card: {
    width: '96%',
    height: 167,
    borderWidth: 2,
    borderColor: '#19398A',
    borderRadius: 10,
    marginTop: 8,
    alignSelf: 'center'
  },
  bgColorOdd: {
    backgroundColor: Colors.odd,
  },
  bgColorEven: {
    backgroundColor: Colors.even,
  },
  winnerTeam: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    textAlign: "center",
    paddingTop: 2,
    paddingBottom: 3,
    fontWeight: 'bold'
  },
  date: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    textAlign: "center",
    paddingTop: 2,
    fontWeight: 'bold'
  },
  teamsContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
    // marginBottom: 3,
    marginBottom: 8,
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
  pointsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 3,
    // backgroundColor: 'green'
  },
  pointsStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    // backgroundColor: 'yellow'
  },
  team1points: {
    textAlign: 'left',
    paddingLeft: 15,
  },
  team2points: {
    textAlign: 'right',
    paddingRight: 15,
  },
  dividerStyle: {
    height: 2,
    backgroundColor: '#19398A'
  },
  // List Styles
  boxContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'space-around',
    // backgroundColor: 'pink'
  },
  heading: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 15
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10,
    marginRight: 10,
    // alignItems: 'center',
    // backgroundColor: 'pink'
    // backgroundColor: '#E6E6E6'
  },
  headingRow: {
    // width: '100%',
    height: 40,
    // backgroundColor: "rgba(25,57,138,1)",
    // backgroundColor: '#1F4F99',
    backgroundColor: '#3D74C7',
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 2,
    // borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    fontFamily: "roboto-regular",
    // color: "rgba(255,255,255,1)",
    color: '#000',
    fontSize: 20,
    alignItems: 'center',
    fontWeight: 'bold'
  },
  headingCol: {
    display: 'flex',
    flexDirection: 'row',
    color: '#000',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headingCol1: {
    width: '57%',
    // backgroundColor: 'green',
  },
  headingCol2: {
    width: '15%',
    // backgroundColor: 'yellow',
  },
  headingCol3: {
    width: '14%',
    // backgroundColor: 'green',
  },
  headingCol4: {
    width: '14%',
    // textAlign: 'right',
    justifyContent: 'flex-end',
    paddingRight: 10,
    // backgroundColor: 'yellow',
  },
  headingColText: {
    paddingRight: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  msgStyle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold'
  },
  listItem: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 5,
    marginTop: 7,
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardItem: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "bold",
    display: 'flex',
    justifyContent: 'space-between',
  },
  name: {
    width: '43%',
    paddingLeft: 10,
    // backgroundColor: 'yellow',
  },
  teamShortName: {
    width: '16%',
    textAlign: 'center',
    fontSize: 17,
    paddingLeft: 5,
    // backgroundColor: 'green',
  },
  bet: {
    textAlign: 'right',
    paddingRight: 8,
    width: '13%',
    // backgroundColor: 'yellow',
  },
  win: {
    textAlign: 'right',
    paddingRight: 8,
    width: '13%',
    // backgroundColor: 'green',
  },
  bgLight: {
    backgroundColor: "#E6E6E6",
  },
  bgDark: {
    backgroundColor: '#87CEFA'
  },
});

export default ResultWithUsersScreen;