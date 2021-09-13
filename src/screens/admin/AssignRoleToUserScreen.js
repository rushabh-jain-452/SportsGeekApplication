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
	Alert
} from 'react-native';
import {
	Dropdown
} from 'sharingan-rn-modal-dropdown';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import { baseurl, errorMessage } from '../../config';
import showSweetAlert from '../../helpers/showSweetAlert';
import axios from 'axios';
import { AuthContext } from '../../../App';

const AssignRoleToUserScreen = ({ navigation }) => {
	const { loginState, logout } = useContext(AuthContext);

	const headers = { 'Authorization': 'Bearer ' + loginState.token };

	const [data, setData] = useState([]);
	const [userData, setUserData] = useState([]);
	const [roleData, setRoleData] = useState([]);
	const [userId, setUserId] = useState(0);
	const [roleId, setRoleId] = useState(0);
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		displayUser();
		displayRole();
	}, []);

	const displayUser = () => {
		axios.get(baseurl + '/users', { headers })
			.then(response => {
				if (response.status == 200) {
					setData(response.data);
					const dt = response.data;
					const arr = [];
					for (let i = 0; i < dt.length; i++) {
						arr.push({
							value: dt[i].userId,
							label: dt[i].username
						});
					}
					setUserData(arr);

				}
				else {
					showSweetAlert('error', 'Network Error', errorMessage);
				}
			})
			.catch(error => {
				showSweetAlert('error', 'Network Error', errorMessage);
				if (error.response && error.response.status === 401) {
					logout();
				}
			})
	}

	const displayRole = () => {
		axios.get(baseurl + '/roles', { headers })
			.then(response => {
				setLoading(false);
				if (response.status == 200) {
					setData(response.data);

					const dt = response.data;

					const arr = [];
					for (let i = 0; i < dt.length; i++) {
						arr.push({
							value: dt[i].roleId,
							label: dt[i].name
						});
					}
					setRoleData(arr);

				}
				else {
					showSweetAlert('error', 'Network Error', errorMessage);
				}
			})
			.catch(error => {
				setLoading(false);
				showSweetAlert('error', 'Network Error', errorMessage);
				if (error.response && error.response.status === 401) {
					logout();
				}
			})
	}

	const assignRoleHandler = () => {
		if (userId == 0) {
			showSweetAlert('warning', 'User not selected', 'Please select User to proceed.');
		}
		else if (roleId == 0) {
			showSweetAlert('warning', 'Role not selected', 'Please select Role to proceed.');
		}
		else {
			setLoading(true);
			axios.put(baseurl + '/users/' + userId + '/update-role/' + roleId, {}, { headers })
				.then((response) => {
					setLoading(false);
					if (response.status == 200) {
						showSweetAlert('success', 'Success', 'Role Assigned successfully.');
					}
					else {
						showSweetAlert('error', 'Error', 'Fail to Assign Role.Please try again after sometime.');
					}
					setUserId(0);
					setRoleId(0);
				})
				.catch((error) => {
					setLoading(false);
					showSweetAlert('error', 'Error', 'Fail to Assign Role.Please try again after sometime.');
					if (error.response && error.response.status === 401) {
						logout();
					}
				})
		}
	}


	const onChangeSS = (value) => {
		setUserId(value);
	};
	const onChangeRole = (value) => {
		setRoleId(value);
	};

	const getConfirmation = (tournamentId) =>
		Alert.alert(
			"Role Confirmation",
			"Do you really want to Assign Role for User?",
			[
				{
					text: "Cancel"
				},
				{
					text: "OK",
					onPress: assignRoleHandler
				}
			]
		);

	return (
		<ScrollView keyboardShouldPersistTaps="handled">
			<Spinner visible={loading} textContent="Loading..." animation="fade" textStyle={styles.spinnerTextStyle} />
			<View style={styles.container}>
				<TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#FFF" size={40} style={{ marginLeft: 15, marginTop: 10 }} /></TouchableOpacity>
				<StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
				<View style={styles.header}>
					<Text style={styles.text_header}>Assign Role to user</Text>
				</View>
				<Animatable.View
					animation="fadeInUpBig"
					style={styles.footer}
				>
					<Text style={[styles.text_footer, { marginTop: 35 }]}>User Name</Text>
					<View style={styles.action}>
						<Dropdown
							label="User Name"
							data={userData}
							enableSearch
							value={userId}
							onChange={onChangeSS}
						/>
					</View>
					<Text style={[styles.text_footer, { marginTop: 35 }]}>Role</Text>
					<View style={styles.action}>
						<Dropdown
							label="Assign Role"
							data={roleData}
							enableSearch
							value={roleId}
							onChange={onChangeRole}
						/>
					</View>
					<View style={styles.button}>
						<TouchableOpacity
							onPress={getConfirmation}
							style={[styles.signIn, {
								borderColor: '#19398A',
								borderWidth: 1,
								marginTop: 10,
								marginBottom: 20
							}]}
						>
							<Text style={[styles.textSign, {
								color: '#19398A'
							}]}>Assign Role</Text>
						</TouchableOpacity>
					</View>

				</Animatable.View>
			</View>
		</ScrollView>
	);
};

export default AssignRoleToUserScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#19398A',
	},
	container2: {
		flex: 1,
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
	},
	button: {
		alignItems: 'center',
		marginTop: 20
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
		height: 50,
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
	buttonTextStyle: {
		color: '#FFFFFF',
		paddingVertical: 10,
		fontSize: 16,
	},
	buttonStyle: {
		backgroundColor: '#19398A',
		borderWidth: 0,
		color: '#FFFFFF',
		borderColor: '#307ecc',
		height: 40,
		alignItems: 'center',
		borderRadius: 30,
		marginLeft: 80,
		marginRight: 35,
		//   marginTop: 15,
		width: '50%'
	}
});