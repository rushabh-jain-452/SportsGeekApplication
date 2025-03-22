import React, { useState, useContext } from 'react';
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
	StatusBar
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import showSweetAlert from '../helpers/showSweetAlert';
import { errorMessage } from '../config';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../App';

const ChangePasswordScreen = ({ navigation }) => {
	const { loginState, logout } = useContext(AuthContext);
	let baseurl = loginState.backendUrl;
	const headers = { 'Authorization': 'Bearer ' + loginState.token };
	const userId = loginState.userId + "";

	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [validNewPassword, setValidNewPassword] = useState(false);
	const [confirmNewPassword, setConfirmNewPassword] = useState('');
	const [secureTextEntry1, setSecureTextEntry1] = useState(true);
	const [secureTextEntry2, setSecureTextEntry2] = useState(true);
	const [secureTextEntry3, setSecureTextEntry3] = useState(true);

	const [loading, setLoading] = React.useState(false);

	const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@%!])[0-9a-zA-Z@%!]{8,}$/;

	const changePasswordHandler = () => {
		;
		if (oldPassword.length == 0) {
			showSweetAlert('warning', 'Invalid Input!', 'Please enter valid old password to proceed.');
		}
		else if (!validNewPassword) {
			showSweetAlert('warning', 'Invalid Input!', 'Please enter valid new password to proceed.');
		}
		else if (newPassword != confirmNewPassword) {
			showSweetAlert('warning', 'Invalid Input!', 'New Password and Confirm New Password must match.');
		}
		else {
			setLoading(true);
			const requestData = {
				userId: userId,
				oldPassword: oldPassword,
				newPassword: newPassword
			};
			axios.put(baseurl + '/users/update-password', requestData, { headers })
				.then((response) => {
					setLoading(false);
					if (response.status == 200) {
						showSweetAlert('success', 'Success', 'Password updated successfully.!');
						navigation.goBack();
					} else {
						showSweetAlert('error', 'Network Error', errorMessage);
					}
				})
				.catch((error) => {
					setLoading(false);
					if (error.response) {
						console.log(error.response.status);
						if (error.response.status == 400) {
							showSweetAlert('warning', 'Invalid Old Password', errorMessage);
						} else if (error.response.status == 401) {
							logout();
							showSweetAlert('error', 'Network error', errorMessage);
						} else if (error.response.status == 500) {
							showSweetAlert('error', 'Network error', errorMessage);
						} else {
							showSweetAlert('warning', 'Network Error', 'Something went wrong. Please check your internet connection or try again after sometime...');
						}
					} else {
						showSweetAlert('error', 'Network Error', errorMessage);
					}
				});
		}
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#FFF" size={40} style={{ marginLeft: 15, marginTop: 10 }} /></TouchableOpacity>
			<Spinner visible={loading} textContent="Loading..." animation="fade" textStyle={styles.spinnerTextStyle} />
			<StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
			<View style={styles.header}>
				<Text style={styles.text_header}>Change Password</Text>
			</View>
			<Animatable.View
				animation="fadeInUpBig"
				style={styles.footer}
			>
				<ScrollView keyboardShouldPersistTaps="handled">
					<Text style={[styles.text_footer, {
						marginTop: 35
					}]}>Old Password</Text>
					<View style={styles.action}>
						<Feather
							name="lock"
							color="#05375a"
							size={20}
						/>
						<TextInput
							placeholder="Your Old Password"
							secureTextEntry={secureTextEntry1 ? true : false}
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => setOldPassword(val)}
						/>
						<TouchableOpacity
							onPress={() => setSecureTextEntry1(!secureTextEntry1)}
						>
							{secureTextEntry1 ?
								<Feather
									name="eye-off"
									color="grey"
									size={20}
								/>
								:
								<Feather
									name="eye"
									color="grey"
									size={20}
								/>
							}
						</TouchableOpacity>
					</View>
					{(oldPassword.length > 0 && oldPassword.length < 8) ?
						<Animatable.View animation="fadeInLeft" duration={500}>
							<Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
						</Animatable.View>
						: null
					}

					<Text style={[styles.text_footer, {
						marginTop: 35
					}]}>New Password</Text>
					<View style={styles.action}>
						<Feather
							name="lock"
							color="#05375a"
							size={20}
						/>
						<TextInput
							placeholder="Your New Password"
							secureTextEntry={secureTextEntry2 ? true : false}
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => {
								setNewPassword(val);
								if (val.match(password_regex))
									setValidNewPassword(true);
								else
									setValidNewPassword(false);
							}}
						/>
						<TouchableOpacity
							onPress={() => setSecureTextEntry2(!secureTextEntry2)}
						>
							{secureTextEntry2 ?
								<Feather
									name="eye-off"
									color="grey"
									size={20}
								/>
								:
								<Feather
									name="eye"
									color="grey"
									size={20}
								/>
							}
						</TouchableOpacity>
					</View>
					{(newPassword.length > 0 && !validNewPassword) ?
						<Animatable.View animation="fadeInLeft" duration={500}>
							<Text style={styles.errorMsg}>Must contain at least 1 number, 1 special character and 1 uppercase 1 lowercase letter, and at least 8 or more characters.</Text>
						</Animatable.View>
						: null
					}

					<Text style={[styles.text_footer, {
						marginTop: 35
					}]}>Confirm New Password</Text>
					<View style={styles.action}>
						<Feather
							name="lock"
							color="#05375a"
							size={20}
						/>
						<TextInput
							placeholder="Confirm Your Password"
							secureTextEntry={secureTextEntry3 ? true : false}
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => setConfirmNewPassword(val)}
						/>
						<TouchableOpacity
							onPress={() => setSecureTextEntry3(!secureTextEntry3)}
						>
							{secureTextEntry3 ?
								<Feather
									name="eye-off"
									color="grey"
									size={20}
								/>
								:
								<Feather
									name="eye"
									color="grey"
									size={20}
								/>
							}
						</TouchableOpacity>
					</View>
					{(newPassword.length > 0 && newPassword != confirmNewPassword) ?
						<Animatable.View animation="fadeInLeft" duration={500}>
							<Text style={styles.errorMsg}>Password and confirm password must match.</Text>
						</Animatable.View>
						: null
					}
					<View style={styles.button}>
						<TouchableOpacity
							onPress={() => { changePasswordHandler() }}
							style={[styles.signIn, {
								borderColor: '#19398A',
								borderWidth: 1,
								marginTop: 15
							}]}
						>
							<Text style={[styles.textSign, {
								color: '#19398A'
							}]}>Change Password</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</Animatable.View>
		</View>
	);
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#19398A'
	},
	header: {
		flex: 1,
		justifyContent: 'flex-end',
		paddingHorizontal: 20,
		paddingBottom: 50
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
		fontSize: 18
	},
	action: {
		flexDirection: 'row',
		marginTop: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#f2f2f2',
		paddingBottom: 5
	},
	textInput: {
		flex: 1,
		marginTop: Platform.OS === 'ios' ? 0 : -12,
		paddingLeft: 10,
		color: '#05375a',
	},
	button: {
		alignItems: 'center',
		marginTop: 50
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
	errorMsg: {
		color: '#FF0000',
		fontSize: 14,
	},
	spinnerTextStyle: {
		color: '#FFF'
	},
});