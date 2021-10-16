import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, TouchableOpacity, RefreshControl, ActivityIndicator, ScrollView, StatusBar } from "react-native";
// import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
// import Svg, { Ellipse } from "react-native-svg";
// import {
//   Avatar
// } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Avatar } from "react-native-elements";
import { useTheme } from 'react-native-paper';
import axios from 'axios';

import showSweetAlert from '../helpers/showSweetAlert';
import getColor from '../helpers/getColor';
import { baseurl, errorMessage } from '../config';
import { AuthContext } from '../../App';

const LeaderBoard = (props) => {
  const { loginState, logout } = useContext(AuthContext);
  const userId = loginState.userId;

  const headers = { 'Authorization': 'Bearer ' + loginState.token };

  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);
  // const [contestData, setContestData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);
  // const { colors } = useTheme();

  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState(1);  // 1 = ASC and -1 = DESC

  useEffect(() => {
    fetchData();
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // console.log('Refreshing...');
    // fetchData();
  }, []);

  const fetchData = () => {
    axios.get(baseurl + '/users/statistics', { headers })
      .then((response) => {
        if (response.status == 200) {
          // setLoading(false);
          // setRefreshing(false);
          // setData(response.data);
          fetchContestData(response.data);
        } else {
          // setData([]);
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

  const fetchContestData = (pointsData) => {
    // console.log('fetchContestData');
    axios.get(baseurl + '/users/future-contest', { headers })
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        if (response.status == 200) {
          // setContestData(response.data);
          // console.log('Data : ');
          // console.log(pointsData);
          // console.log('Contest Data : ');
          // console.log(response.data);
          const contestData = response.data;
          pointsData.forEach((item) => {
            const obj = contestData.find(o => o.userId == item.userId);
            if (obj) {
              // console.log('found');
              item.availablePoints += obj.contestPoints;
            }
          });
          // console.log('After Adding Future Points : ');
          // console.log(pointsData);
          // pointsData.sort((a, b) => (b.availablePoints - a.availablePoints));
          pointsData.sort((a, b) => {
            if (a.availablePoints < b.availablePoints) {
              return 1;
            } else if (a.availablePoints > b.availablePoints) {
              return -1;
            } else {
              const val1 = a.firstName.toLowerCase() + ' ' + a.lastName.toLowerCase();
              const val2 = b.firstName.toLowerCase() + ' ' + b.lastName.toLowerCase();
              if (val1 < val2) {
                return -1;
              }
              if (val1 > val2) {
                return 1;
              }
              return 0;
            }
          });
          // pointsData.forEach((item, index) => item.rank = index + 1);
          // Same rank for same points
          const pointsArr = [...new Set(pointsData.map(item => item.availablePoints))];
          pointsData.forEach((item, index) => item.rank = pointsArr.indexOf(item.availablePoints) + 1);
          // console.log('After Sorting : ');
          // console.log(pointsData);
          setData(pointsData);
          setDataCopy(pointsData);
          // console.log('setData');
        } else {
          // setContestData([]);
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
      case 'rank':
        setData((oldData) => {
          const newData = [...oldData];
          newData.sort((a, b) => (a.rank - b.rank) * order);
          return newData;
        });
        break;
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
      case 'points':
        setData((oldData) => {
          const newData = [...oldData];
          newData.sort((a, b) => (a.rank - b.rank) * order);
          return newData;
        });
        break;
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl enabled={true} refreshing={refreshing} onRefresh={onRefresh} />} >
      <StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
      {loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
      {
        dataCopy.length > 1 &&
        <View style={styles.rectStackRow}>
          {dataCopy.length >= 2 && <TopUser rank="2" data={dataCopy[1]} boxStyle={styles.box1} />}
          {dataCopy.length >= 1 && <TopUser rank="1" data={dataCopy[0]} boxStyle={styles.box2} />}
          {dataCopy.length >= 3 && <TopUser rank="3" data={dataCopy[2]} boxStyle={styles.box3} />}
        </View>
      }
      {
        data.length > 0 &&
        <View style={styles.listContainer}>
          <View style={styles.headingRow}>
            <TouchableOpacity
              onPress={() => { sort('rank') }}
              style={[styles.headingCol, styles.headingCol1]}>
              <Text style={styles.headingColText}>Rank</Text>
              <FontAwesome name="sort" color="#000" size={15} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { sort('name') }}
              style={[styles.headingCol, styles.headingCol2]}>
              <Text style={styles.headingColText}>Name</Text>
              <FontAwesome name="sort" color="#000" size={15} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { sort('points') }}
              style={[styles.headingCol, styles.headingCol3]}>
              <Text style={styles.headingColText}>Points</Text>
              <FontAwesome name="sort" color="#000" size={15} />
            </TouchableOpacity>
          </View>
          {/* <View style={styles.headingRow}>
          <Text style={styles.headingCol1}>Rank</Text>
          <Text style={styles.headingCol2}>Name</Text>
          <Text style={styles.headingCol3}>Points</Text>
        </View> */}
          {
            data && data.map((item, index) => {
              const mystyle = item.userId == userId ? styles.bgDark : styles.bgLight;
              return (
                <View style={[styles.card, mystyle]} key={item.userId}>
                  <Text style={[styles.carditem, styles.rank]}>{item.rank}</Text>
                  {
                    item.profilePicture != '' ?
                      (<Avatar
                        size="small"
                        rounded
                        source={{
                          uri: item.profilePicture
                        }}
                      />) :
                      (<Avatar
                        size="small"
                        rounded
                        title={item.firstName.substr(0, 1) + item.lastName.substr(0, 1)}
                        containerStyle={{ backgroundColor: getColor(item.firstName) }}
                      />)
                  }
                  <Text style={[styles.carditem, styles.name]}>{item.firstName + " " + item.lastName}</Text>
                  <Text style={[styles.carditem, styles.points]}>{item.availablePoints}</Text>
                </View>
              )
            })
          }
          {/* <View style={{ height: 50 }}></View> */}
        </View>
      }
    </ScrollView>
  );
}

export default LeaderBoard;

const TopUser = (props) => {
  const data = props.data;
  const rank = props.rank;
  const avatarSize = rank == 1 ? 'large' : 'medium';

  return (
    <View style={[styles.box, props.boxStyle]}>
      <View style={styles.ellipse}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>{rank}</Text>
      </View>
      {
        data.profilePicture != '' ?
          (<Avatar
            size={avatarSize}
            rounded
            source={{
              uri: data.profilePicture
            }}
            containerStyle={{ marginTop: 10 }}
          />) :
          (<Avatar
            size={avatarSize}
            rounded
            title={data.firstName.substr(0, 1) + data.lastName.substr(0, 1)}
            // activeOpacity={0.7}
            containerStyle={{ marginTop: 10, backgroundColor: getColor(data.firstName) }}
          />)
      }
      <Text style={styles.boxUsername}>{data.firstName + " " + data.lastName}</Text>
      <Text style={styles.boxPoints}>{data.availablePoints}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: "rgba(241,241,241,1)"
  },
  ellipse: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: '#19398A',
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#62B1F6',
    // backgroundColor: '#6FA0CA',
    position: 'absolute',
    right: 5,
    top: -20
  },
  rectStackRow: {
    display: "flex",
    height: 170,
    flexDirection: "row",
    justifyContent: 'space-around',
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    alignItems: 'flex-end'
  },
  box: {
    width: '32%',
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#19398A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  box1: {
    height: 140
  },
  box2: {
    height: 160
  },
  box3: {
    height: 120
  },
  boxUsername: {
    color: "#212121",
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  boxPoints: {
    color: "#121212",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: 'center',
  },
  popular: {
    color: '#000',
    fontSize: 18,
    marginTop: 10,
    marginLeft: 10
  },
  listContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: 10
  },
  // headingRow: {
  //   width: '100%',
  //   height: 35,
  //   // backgroundColor: "rgba(25,57,138,1)",
  //   // backgroundColor: '#1F4F99',
  //   backgroundColor: '#3D74C7',
  //   borderWidth: 0,
  //   borderColor: "#000000",
  //   borderRadius: 5,
  //   display: 'flex',
  //   flexDirection: "row",
  //   marginTop: 5,
  //   fontFamily: "roboto-regular",
  //   // color: "rgba(255,255,255,1)",
  //   color: '#000',
  //   fontSize: 20,
  //   alignItems: 'center',
  //   fontWeight: 'bold'
  // },
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
    width: '20%',
    // width: 40,
    justifyContent: 'flex-start',
    paddingLeft: 10,
    // backgroundColor: 'green'
  },
  headingCol2: {
    width: '60%',
    // textAlign: 'left',
    // alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: 40,
    // backgroundColor: 'yellow',
  },
  headingCol3: {
    width: '20%',
    // textAlign: 'right',
    justifyContent: 'flex-end',
    paddingRight: 10,
    // backgroundColor: 'red',
  },
  headingColText: {
    paddingRight: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  card: {
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
  bgLight: {
    backgroundColor: "#E6E6E6",
  },
  bgDark: {
    backgroundColor: '#87CEFA'
  },
  carditem: {
    color: "#121212",
    fontSize: 18,
    fontWeight: "bold",
    display: 'flex',
    justifyContent: 'space-between',
    //    textAlign: 'center'
  },
  rank: {
    // width: '10%',
    width: 40,
    textAlign: 'center',
    // backgroundColor: 'yellow',
  },
  name: {
    width: '62%',
    fontSize: 17,
    paddingLeft: 7,
    // backgroundColor: 'green',
  },
  points: {
    width: '18%',
    textAlign: 'right',
    paddingRight: 10,
    // backgroundColor: 'yellow',
  },
});