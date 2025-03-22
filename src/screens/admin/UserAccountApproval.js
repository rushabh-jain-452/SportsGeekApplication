import React, { useState, useEffect, useContext } from 'react';
import {
	View,
	Text,
	Button,
	TouchableOpacity,
	Dimensions,
	TextInput,
	Platform,
	StyleSheet,
	ScrollView,
	StatusBar,
	LogBox,
	ActivityIndicator,
	RefreshControl,
	Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import showSweetAlert from '../../helpers/showSweetAlert';
import { errorMessage } from '../../config';
import { Card } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import { AuthContext } from '../../../App';

const UserAccountApproval = ({ navigation }) => {
	const { loginState, logout } = useContext(AuthContext);
	let baseurl = loginState.backendUrl;

	const headers = { 'Authorization': 'Bearer ' + loginState.token };

	const [data, setData] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [waiting, setWaiting] = React.useState(false);

	useEffect(() => {
		displayUser();
	}, [refreshing]);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		// console.log('Token on refresh : ' + token);
		// displayUser();
	}, []);

	const displayUser = () => {
		const userStatus = 0;
		setWaiting(true);
		axios.get(baseurl + '/users/user-with-status/' + userStatus, { headers })
			.then(response => {
				setWaiting(false);
				if (response.status == 200) {
					setData(response.data);
				}
				else {
					// setData([]);
					showSweetAlert('error', 'Network Error', errorMessage);
				}
				setRefreshing(false);
			})
			.catch(error => {
				setWaiting(false);
				setRefreshing(false);
				showSweetAlert('error', 'Network Error', errorMessage);
				if (error.response && error.response.status === 401) {
					logout();
				}
			})
	}

	const updateUser = (userId) => {
		// const userStatus = true;
		setWaiting(true);
		axios.put(baseurl + '/users/' + userId + '/update-status/true', {}, { headers })
			.then((response) => {
				setWaiting(false);
				if (response.status == 200) {
					showSweetAlert('success', 'Success', 'User Approved');
					displayUser();
				}
				else {
					showSweetAlert('error', 'Error', 'Failed to update Status. Please try again...');
				}
			})
			.catch((error) => {
				setWaiting(false);
				console.log(error)
				showSweetAlert('error', 'Error', 'Failed to update Status. Please try again...');
				if (error.response && error.response.status === 401) {
					logout();
				}
			})
	}

	const getConfirmation = (userId, username) =>
		Alert.alert(
			"Account Approval Confirmation",
			"Do you really want to activate the account of " + username + "  ?",
			[
				{
					text: "Cancel"
				},
				{
					text: "OK",
					onPress: () => { updateUser(userId) }
				}
			]
		);

	return (
		<ScrollView keyboardShouldPersistTaps="handled" style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
			<TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#FFF" size={40} style={{ marginLeft: 15, marginTop: 10 }} /></TouchableOpacity>
			<Spinner visible={waiting} textContent="Loading..." animation="fade" textStyle={styles.spinnerTextStyle} />
			{loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
			<StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
			<View style={styles.header}>
				<Text style={styles.text_header}>User Approval</Text>
			</View>
			<Animatable.View
				animation="fadeInUpBig"
				style={styles.footer}
			>
				{data.length == 0 && (<Text style={{ fontSize: 20, fontWeight: 'bold' }}>No users approval pending...</Text>)}
				{
					data.length > 0 && data.map((item, index) => (
						<View style={styles.card} key={item.userId} >
							<View style={styles.cardlist}>
								<View style={styles.ellipse1}>
									<Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>{item.firstName.substr(0, 1) + item.lastName.substr(0, 1)}</Text>
								</View>
								<Text style={[styles.carditem, { width: '40%', paddingLeft: 20 }]}>{item.firstName + " " + item.lastName}</Text>
								<Text style={[styles.carditem, { width: '35%', paddingLeft: 20 }]}>{item.username}</Text>
								{/* <Text style={[styles.carditem, {width: '50%',paddingLeft:20}]}>{item.email}</Text> */}
								<TouchableOpacity onPress={() => { getConfirmation(item.userId, item.username) }} style={{ width: '10%' }}><Text style={[styles.carditem]}><Icon name="account-check" color="#19398A" size={30} /></Text></TouchableOpacity>
							</View>
						</View>
					))
				}
			</Animatable.View>
		</ScrollView>
	);
};

export default UserAccountApproval;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#19398A',
	},
	container2: {
		// height:50,
		flex: 1,
		// paddingHorizontal: 20,
		// paddingVertical: 5,
		paddingHorizontal: 30,
		marginRight: 20,
		color: '#19398A',
		backgroundColor: '#f00',
		alignItems: 'stretch',
		justifyContent: 'center',
		alignSelf: 'stretch'
	},
	header: {
		flex: 1,
		justifyContent: 'flex-end',
		paddingHorizontal: 20,
		paddingBottom: 30
	},
	footer: {
		flex: Platform.OS === 'ios' ? 3 : 5,
		backgroundColor: '#fff',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingHorizontal: 20,
		paddingVertical: 30
	},
	text_header: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 30
	},
	text_footer: {
		color: '#05375a',
		fontSize: 18,

	},
	action: {
		flexDirection: 'row',
		marginTop: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#f2f2f2',
		paddingBottom: 1
	},
	textInput: {
		flex: 1,
		marginTop: Platform.OS === 'ios' ? 0 : -12,
		paddingLeft: 10,
		color: '#05375a',
		// borderBottomWidth: 1
	},
	button: {
		alignItems: 'center',
		// marginTop: 20
	},
	signIn: {
		width: '100%',
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10
	},
	textSign: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	textPrivate: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 20
	},
	color_textPrivate: {
		color: 'grey'
	},
	row: {
		alignSelf: 'stretch',
		paddingBottom: 10,
		paddingTop: 5,
		paddingLeft: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#808080',
		backgroundColor: '#FFF'
	},
	card: {
		width: '100%',
		height: 65,
		backgroundColor: "#E6E6E6",
		borderWidth: 1,
		borderColor: "#000000",
		borderRadius: 3,
		marginTop: 5,
		// marginLeft: 8,
		display: "flex",
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 3
	},
	text_header1: {
		color: '#000',
		fontWeight: 'bold',
		fontSize: 20,
		textAlign: 'center',
		marginTop: 50
	},
	cardlist: {
		display: "flex",
		flexDirection: "row",
		marginTop: 4,
		justifyContent: "space-between",
	},
	ellipse1: {
		width: 40,
		height: 40,
		//   marginTop: 0,
		borderRadius: 100,
		marginLeft: 10,
		justifyContent: 'center',
		backgroundColor: '#e9c46a'
	},
	carditem: {
		color: "#121212",
		fontSize: 20,
		marginLeft: 3,
		marginTop: 5,
		fontWeight: "bold",
		display: 'flex',
		//    backgroundColor:'red'
		//    justifyContent: 'space-between',  
		//    textAlign: 'center'
	},
	spinnerTextStyle: {
		color: '#FFF'
	}
});