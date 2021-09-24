import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ScheduleScreen from '../screens/ScheduleScreen';
import HelpScreen from '../screens/HelpScreen';
import GenderScreen from '../screens/admin/GenderScreen';
import ContestScreen from '../screens/ContestScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import UpdateProfileScreen from '../screens/UpdateProfileScreen';
import LiveMatchDetailsScreen from '../screens/LiveMatchDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PlayerDetailofTeam from '../screens/PlayerDetailofTeam';
import UpdateProfilePictureScreen from '../screens/UpdateProfilePictureScreen';
// Admin Screens
import RoleScreen from '../screens/admin/RoleScreen';
import PlayerTypeScreen from '../screens/admin/PlayerTypeScreen';
import VenueScreen from '../screens/admin/VenueScreen';
import TournamentScreen from '../screens/admin/TournamentScreen';
import TeamScreen from '../screens/admin/TeamScreen';
import UpdateMatchScheduleScreen from '../screens/admin/UpdateMatchScheduleScreen';
import UpdateMatchResultScreen from '../screens/admin/UpdateMatchResultScreen';
import UserAccountApproval from '../screens/admin/UserAccountApproval';
import ListAllUsersScreen from '../screens/admin/ListAllUsersScreen';
import PlayerScreen from '../screens/admin/PlayerScreen';
import MatchesScreen from '../screens/admin/MatchesScreen';
import RechargeScreen from '../screens/admin/RechargeScreen';
import AssignRoleToUserScreen from '../screens/admin/AssignRoleToUserScreen';
import DeleteScreen from '../screens/admin/DeleteScreen';
import UpdateUserScreen from '../screens/admin/UpdateUserScreen';
import ResultWithUsersScreen from '../screens/ResultWithUsersScreen';
import UpdateMatchMinBet from '../screens/admin/UpdateMatchMinBet';
import UpdateMatchMinBetSchedule from '../screens/admin/UpdateMatchMinBetSchedule';
import UpdateActiveTournamentScreen from '../screens/admin/UpdateActiveTournamentScreen';
import MatchesScheduleScreenForUpdate from '../screens/admin/MatchesScheduleScreenForUpdate';
import PlayerDetailScreenForUpdate from '../screens/admin/PlayerDetailScreenForUpdate';
import RemovePublicChatScreen from '../screens/admin/RemovePublicChatScreen';
import MainTab from './MainTab';

const Stack = createStackNavigator();

const HomeStack = ({ navigation }) => (
  <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
    <Stack.Screen name="Home" component={MainTab} />
    <Stack.Screen name="changePasswordScreen" component={ChangePasswordScreen} />
    <Stack.Screen name="GenderScreen" component={GenderScreen} />
    <Stack.Screen name="UpdateProfileScreen" component={UpdateProfileScreen} />
    <Stack.Screen name="UpdateProfilePictureScreen" component={UpdateProfilePictureScreen} />
    <Stack.Screen name="ContestScreen" component={ContestScreen} />
    <Stack.Screen name="RoleScreen" component={RoleScreen} />
    <Stack.Screen name="PlayerTypeSCreen" component={PlayerTypeScreen} />
    <Stack.Screen name="VenueScreen" component={VenueScreen} />
    <Stack.Screen name="TournamentScreen" component={TournamentScreen} />
    <Stack.Screen name="TeamScreen" component={TeamScreen} />
    <Stack.Screen name="UpdateMatchScheduleScreen" component={UpdateMatchScheduleScreen} />
    <Stack.Screen name="UpdateMatchResultScreen" component={UpdateMatchResultScreen} />
    <Stack.Screen name="UserAccountApproval" component={UserAccountApproval} />
    <Stack.Screen name="ListAllUsersScreen" component={ListAllUsersScreen} />
    <Stack.Screen name="PlayerScreen" component={PlayerScreen} />
    <Stack.Screen name="MatchesScreen" component={MatchesScreen} />
    <Stack.Screen name="RechargeScreen" component={RechargeScreen} />
    <Stack.Screen name="AssignRoleToUser" component={AssignRoleToUserScreen} />
    <Stack.Screen name="DeleteScreen" component={DeleteScreen} />
    <Stack.Screen name="UpdateUserScreen" component={UpdateUserScreen} />
    <Stack.Screen name="HelpScreen" component={HelpScreen} />
    <Stack.Screen name="ResultWithUsersScreen" component={ResultWithUsersScreen} />
    <Stack.Screen name="UpdateMatchMinBetSchedule" component={UpdateMatchMinBetSchedule} />
    <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} />
    <Stack.Screen name="UpdateMatchMinBet" component={UpdateMatchMinBet} />
    <Stack.Screen name="LiveMatchDetailsScreen" component={LiveMatchDetailsScreen} />
    <Stack.Screen name="UpdateActiveTournamentScreen" component={UpdateActiveTournamentScreen} />
    <Stack.Screen name="MatchesScheduleScreenForUpdate" component={MatchesScheduleScreenForUpdate} />
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    <Stack.Screen name="PlayerDetailofTeam" component={PlayerDetailofTeam} />
    <Stack.Screen name="PlayerDetailScreenForUpdate" component={PlayerDetailScreenForUpdate} />
    <Stack.Screen name="RemovePublicChatScreen" component={RemovePublicChatScreen} />
  </Stack.Navigator>
);

export default HomeStack;