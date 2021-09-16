import React, { useState, useEffect, useContext } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import {
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import { Avatar } from "react-native-elements";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

// import ChangePasswordScreen from './ChangePasswordScreen';
import showSweetAlert from '../helpers/showSweetAlert';
import getColor from '../helpers/getColor';
import { baseurl, errorMessage } from '../config';
import * as Colors from '../config/Colors';
import { AuthContext } from '../../App';

const ProfileScreen = ({ navigation }) => {
  const { loginState, logout } = useContext(AuthContext);
  const userId = parseInt(loginState.userId);

  const headers = { 'Authorization': 'Bearer ' + loginState.token };

  const [data, setData] = useState(null);
  const [points, setPoints] = useState(null);
  // const [winningPoints, setWinningPoints] = useState(null);
  // const [losingPoints, setLosingPoints] = useState(null);
  // const [winningMatches, setWinningMatches] = useState(null);
  // const [losingMatches, setLosingMatches] = useState(null);
  // const [shortName, setShortName] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    displayProfile();
    displayWinningAndLosingPoints();
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  const displayProfile = () => {
    axios.get(baseurl + '/users/' + userId, { headers })
      .then((response) => {
        if (response.status == 200) {
          const data = response.data;
          // setShortName(response.data.firstName.substr(0, 1) + response.data.lastName.substr(0, 1));
          data.shortName = response.data.firstName.substr(0, 1) + response.data.lastName.substr(0, 1);
          // console.log(data);
          setData(data);
        } else {
          setData({});
          showSweetAlert('error', 'Network Error', errorMessage);
        }
      })
      .catch((error) => {
        console.log('Error 1');
        showSweetAlert('error', 'Network Error', errorMessage);
        if (error.response && error.response.status === 401) {
          logout();
        }
      });
  }

  const displayWinningAndLosingPoints = () => {
    axios.get(baseurl + '/users/' + userId + '/winning-losing-points', { headers })
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        if (response.status == 200) {
          // setWinningPoints(response.data.winningPoints);
          // setLosingPoints(response.data.losingPoints);
          // setWinningMatches(response.data.numberOfWinningMatches);
          // setLosingMatches(response.data.numberOfLosingMatches);
          setPoints(response.data);
        } else {
          showSweetAlert('error', 'Network Error', errorMessage);
        }
      })
      .catch((error) => {
        // console.log(error);
        // console.log(error.response);
        setLoading(false);
        setRefreshing(false);
        showSweetAlert('error', 'Network Error', errorMessage);
        if (error.response && error.response.status === 401) {
          logout();
        }
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#19398A" size={40} style={{ marginLeft: 15, marginTop: 10 }} /></TouchableOpacity>
      <ScrollView keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
        {
          data &&
          <View>
            <View style={styles.userInfoSection}>
              <View style={{ flexDirection: 'row', marginTop: 15 }}>
                {
                  data.profilePicture ?
                    (<Avatar
                      size="large"
                      rounded
                      source={{
                        uri: data.profilePicture
                      }}
                    />) :
                    (<Avatar
                      size="large"
                      rounded
                      title={data.shortName}
                      activeOpacity={0.7}
                      containerStyle={{ color: 'red', backgroundColor: getColor(data.shortName) }}
                    />)
                }
                <View style={{ marginLeft: 20 }}>
                  <Title style={[styles.title, {
                    marginTop: 5,
                    marginBottom: 5,
                  }]}>{data.firstName} {data.lastName}</Title>
                  <Caption style={styles.caption}>{data.username}</Caption>
                </View>
              </View>
            </View>
            <View style={styles.userInfoSection}>
              <View style={styles.row}>
                <Icon name="phone" color="#19398A" size={25} />
                <Text style={{ color: "#000000", marginLeft: 20, fontSize: 16 }}>{data.mobileNumber}</Text>
              </View>
              <View style={styles.row}>
                <Icon name="email" color="#19398A" size={25} />
                <Text style={{ color: "#000000", marginLeft: 20, fontSize: 16 }}>{data.email}</Text>
              </View>
            </View>
            {
              points &&
              <View style={styles.infoBoxWrapper}>
                <View style={styles.infoBox}>
                  <Caption style={{ color: Colors.blue }}>Available Points</Caption>
                  <Title style={{ color: Colors.blue, fontWeight: 'bold' }}>{data.availablePoints}</Title>
                </View>
                <View style={styles.infoBox}>
                  <Caption style={{ color: Colors.green }}>Total Winnings</Caption>
                  <Title style={{ color: Colors.green, fontWeight: 'bold' }}>{points.winningPoints}</Title>
                  <Text style={{ color: Colors.green }}>( {points.numberOfWinningMatches} matches)</Text>
                </View>
                <View style={styles.infoBox}>
                  <Caption style={{ color: Colors.red }}>Total Losing</Caption>
                  <Title style={{ color: Colors.red, fontWeight: 'bold' }}>{points.losingPoints}</Title>
                  <Text style={{ color: Colors.red }}>( {points.numberOfLosingMatches} matches)</Text>
                </View>
              </View>
            }
          </View>
        }
        <View style={styles.menuWrapper}>
          <TouchableRipple onPress={() => { navigation.navigate('UpdateProfileScreen') }}>
            <View style={styles.menuItem}>
              <Icon name="account-edit" color="#19398A" size={25} />
              <Text style={styles.menuItemText}>Update My Profile</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => navigation.navigate('changePasswordScreen')}>
            <View style={styles.menuItem}>
              <Icon name="form-textbox-password" color="#19398A" size={25} />
              <Text style={styles.menuItemText}>Change Password</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => { logout() }}>
            <View style={styles.menuItem}>
              <Icon name="logout-variant" color="#19398A" size={25} />
              <Text style={styles.menuItemText}>Logout</Text>
            </View>
          </TouchableRipple>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// function updatePassword() {
//   return (
//     <ChangePasswordScreen />
//   );
// }

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftColor: '#dddddd',
    borderLeftWidth: 1,
    borderRightColor: '#dddddd',
    borderRightWidth: 1,
    color: '#00F'
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#000000',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});