import React from 'react';
import { View, Text, Button, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Card } from 'react-native-elements'
import { createStackNavigator } from '@react-navigation/stack';
import { Container, Header, Content, CardItem, Thumbnail, Left, Body } from 'native-base';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AdminScreen = ({ navigation }) => {

  const [index, setIndex] = React.useState(0)
  const isCarousel = React.useRef(null)
  const { colors } = useTheme();
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
      <Collapse>
        <CollapseHeader>
          <View style={styles.menuWrapper}>
            <View style={styles.menuItem}>
              <Icon name="account" color="#19398A" size={25} />
              <Text style={styles.menuItemText}> User</Text>
            </View>
          </View>
        </CollapseHeader>
        <CollapseBody>
          <View style={styles.menuWrapper1}>
            <TouchableRipple onPress={() => { navigation.navigate('UserAccountApproval') }}>
              <View style={styles.menuItem1}>
                <Icon name="account-check" color="#19398A" size={25} />
                <Text style={styles.menuItemText1}>Account Approval</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={() => { navigation.navigate('ListAllUsersScreen') }}>
              <View style={styles.menuItem1}>
                <Icon name="account-edit" color="#19398A" size={25} />
                <Text style={styles.menuItemText1}>Update User</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={() => { navigation.navigate('RechargeScreen') }}>
              <View style={styles.menuItem1}>
                <Icon name="wallet" color="#19398A" size={25} />
                <Text style={styles.menuItemText1}>Recharge</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={() => { navigation.navigate('AssignRoleToUser') }}>
              <View style={styles.menuItem1}>
                <Icon name="account-group" color="#19398A" size={25} />
                <Text style={styles.menuItemText1}>Assign Role to User</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={() => { navigation.navigate('DeleteScreen') }}>
              <View style={styles.menuItem1}>
                <Icon name="account-cancel" color="#19398A" size={25} />
                <Text style={styles.menuItemText1}>Delete User</Text>
              </View>
            </TouchableRipple>
          </View>
        </CollapseBody>
      </Collapse>
      {/* <Collapse>
        <CollapseHeader>
          <View style={styles.menuWrapper}>
            <TouchableRipple onPress={() => { navigation.navigate('GenderScreen') }}>
              <View style={styles.menuItem}>
                <Icon name="gender-male-female" color="#19398A" size={25} />
                <Text style={styles.menuItemText}> Gender</Text>
              </View>
            </TouchableRipple>
          </View>
        </CollapseHeader>
      </Collapse> */}
      <Collapse>
        <CollapseHeader>
          <View style={styles.menuWrapper}>
            <View style={styles.menuItem}>
              <Icon name="tournament" color="#19398A" size={25} />
              <Text style={styles.menuItemText}>Tournaments</Text>
            </View>
          </View>
        </CollapseHeader>
        <CollapseBody>
          <View style={styles.menuWrapper1}>
            <TouchableRipple onPress={() => { navigation.navigate('TournamentScreen') }}>
              <View style={styles.menuItem1}>
                <Icon name="tournament" color="#19398A" size={25} />
                <Text style={styles.menuItemText1}>Tournament</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={() => { navigation.navigate('UpdateActiveTournamentScreen') }}>
              <View style={styles.menuItem1}>
                <Icon name="account-check" color="#19398A" size={25} />
                <Text style={styles.menuItemText1}>Update Active Tournament</Text>
              </View>
            </TouchableRipple>
          </View>
        </CollapseBody>
      </Collapse>
      <Collapse>
        <CollapseHeader>
          <View style={styles.menuWrapper}>
            <View style={styles.menuItem}>
              <Icon name="cricket" color="#19398A" size={25} />
              <Text style={styles.menuItemText}>Players</Text>
            </View>
          </View>
        </CollapseHeader>
        <CollapseBody>
          <View style={styles.menuWrapper1}>
            <TouchableRipple onPress={() => { navigation.navigate('PlayerScreen') }}>
              <View style={styles.menuItem1}>
                <Icon name="cricket" color="#19398A" size={25} />
                <Text style={styles.menuItemText1}>Player</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={() => { navigation.navigate('PlayerDetailScreenForUpdate') }}>
              <View style={styles.menuItem1}>
                <Icon name="cricket" color="#19398A" size={25} />
                <Text style={styles.menuItemText1}>Player Details</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={() => { navigation.navigate('PlayerTypeSCreen') }}>
              <View style={styles.menuItem1}>
                <Icon name="cricket" color="#19398A" size={25} />
                <Text style={styles.menuItemText1}>Player-Type</Text>
              </View>
            </TouchableRipple>
          </View>
        </CollapseBody>
      </Collapse>
      <Collapse>
        <CollapseHeader>
          <View style={styles.menuWrapper}>
            <TouchableRipple onPress={() => { navigation.navigate('TeamScreen') }}>
              <View style={styles.menuItem}>
                <Icon name="microsoft-teams" color="#19398A" size={25} />
                <Text style={styles.menuItemText}>Teams</Text>
              </View>
            </TouchableRipple>
          </View>
        </CollapseHeader>
      </Collapse>
      <Collapse>
        <CollapseHeader>
          <View style={styles.menuWrapper}>
            <View style={styles.menuItem}>
              <Icon name="cricket" color="#19398A" size={25} />
              <Text style={styles.menuItemText}>Matches</Text>
            </View>
          </View>
        </CollapseHeader>
        <CollapseBody>
          <View style={styles.menuWrapper1}>
            <TouchableRipple onPress={() => { navigation.navigate('MatchesScreen') }}>
              <View style={styles.menuItem1}>
                <Icon name="calendar" color="#19398A" size={25} />
                <Text style={styles.menuItemText1}>Add Matches</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={() => { navigation.navigate('MatchesScheduleScreenForUpdate') }}>
              <View style={styles.menuItem1}>
                <Icon name="account-edit" color="#19398A" size={25} />
                <Text style={styles.menuItemText1}>Edit/Delete Matches</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={() => { navigation.navigate('UpdateMatchMinBetSchedule') }}>
              <View style={styles.menuItem1}>
                <Icon name="wallet" color="#19398A" size={25} />
                <Text style={styles.menuItemText}>Update Match Minimum BetPoints</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={() => { navigation.navigate('UpdateMatchScheduleScreen') }}>
              <View style={styles.menuItem1}>
                <Icon name="scoreboard" color="#19398A" size={25} />
                <Text style={styles.menuItemText}>Update Match Result</Text>
              </View>
            </TouchableRipple>
          </View>
        </CollapseBody>
      </Collapse>
      <Collapse>
        <CollapseHeader>
          <View style={styles.menuWrapper}>
            <TouchableRipple onPress={() => { navigation.navigate('VenueScreen') }}>
              <View style={styles.menuItem}>
                <Icon name="sitemap" color="#19398A" size={25} />
                <Text style={styles.menuItemText}>Venue</Text>
              </View>
            </TouchableRipple>
          </View>
        </CollapseHeader>
      </Collapse>
      {/* <Collapse>
        <CollapseHeader>
          <View style={styles.menuWrapper}>
            <TouchableRipple onPress={() => { navigation.navigate('RoleScreen') }}>
              <View style={styles.menuItem}>
                <Icon name="account-group" color="#19398A" size={25} />
                <Text style={styles.menuItemText}>Role</Text>
              </View>
            </TouchableRipple>
          </View>
        </CollapseHeader>
      </Collapse> */}
      <Collapse>
        <CollapseHeader>
          <View style={styles.menuWrapper}>
            <TouchableRipple onPress={() => { navigation.navigate('RemovePublicChatScreen') }}>
              <View style={styles.menuItem}>
                <Icon name="chat" color="#19398A" size={25} />
                <Text style={styles.menuItemText}>Delete Chat Message</Text>
              </View>
            </TouchableRipple>
          </View>
        </CollapseHeader>
      </Collapse>
    </ScrollView>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    height: 60,
    backgroundColor: "rgba(241,241,241,1)",
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 8,
    marginTop: 10,
    // marginLeft: 19,
    display: "flex", flexDirection: 'row',
    flexDirection: "row",
    // justifyContent:'space-between'
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
  menuItem1: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 50,
  },
  menuItemText1: {
    color: '#000000',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});