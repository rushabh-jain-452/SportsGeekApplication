import React, { useState, useEffect } from 'react';
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
import { Avatar } from "react-native-elements";
import SweetAlert from 'react-native-sweet-alert';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { baseurl, errorMessage } from '../config';

const SignUpScreen = ({ navigation }) => {

	// const userAvatarLogo = 'https://firebasestorage.googleapis.com/v0/b/sportsgeek-74e1e.appspot.com/o/4190b851-0e15-454d-84f3-1387c972555b.jpg?alt=media'; 
	const userAvatarLogo = 'https://firebasestorage.googleapis.com/v0/b/sportsgeek-74e1e.appspot.com/o/69bba4a0-c114-4379-9854-e4381a3130bc.png?alt=media';

	// Initial points for User
	const availablePoints = 500;

	const [firstName, setFirstName] = useState('');
	const [validFirstName, setValidFirstName] = useState(false);
	const [lastName, setLastName] = useState('');
	const [validLastName, setValidLastName] = useState(false);
	const [email, setEmail] = useState('');
	const [validEmail, setValidEmail] = useState(false);
	const [mobileNumber, setMobileNumber] = useState('');
	const [genderId, setGenderId] = useState(0);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [validPassword, setValidPassword] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState('');
	const [secureTextEntry, setSecureTextEntry] = useState(true);
	const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
	const [avatarPath, setAvatarPath] = useState(userAvatarLogo);
	const [profilePicture, setProfilePicture] = useState(null);
	const [valid, setValid] = useState(true);
	const [loading, setLoading] = React.useState(false);
	const [success, setSuccess] = useState(false);

	const [genderData, setGenderData] = useState([]);

	const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@%!])[0-9a-zA-Z@%!]{8,}$/;
	const name_regex = /^[a-zA-Z]+$/;

	useEffect(() => {
		axios.get(baseurl + '/genders')
			.then((response) => {
				if (response.status == 200) {
					setGenderData(response.data);
				} else {
					showSweetAlert('error', 'Network Error', errorMessage);
				}
			})
			.catch((error) => {
				showSweetAlert('error', 'Network Error', errorMessage);
			});
	}, []);

	const showSweetAlert = (status, title, msg) => {
		SweetAlert.showAlertWithOptions({
			title: title,
			subTitle: msg,
			confirmButtonTitle: 'OK',
			confirmButtonColor: '#000',
			style: status,
			cancellable: true
		},
			() => {
				setLoading(false);
				if (success == true) {
					setSuccess(false);
					navigation.goBack();
				}
			}
		);
	}

	const validateImage = (image) => {
		let result = true;
		if (image.height != image.width) {
			result = false;
			showSweetAlert('warning', 'Image validation failed!', 'Please select a square image.');
		}
		else if (image.mime != "image/jpeg" && image.mime != "image/png" && image.mime != "image/gif") {
			result = false;
			showSweetAlert('warning', 'Image validation failed!', 'Please select image of proper format. Only jpg, png and gif images are allowed.');
		}
		else if (image.size > 10485760) {
			result = false;
			showSweetAlert('warning', 'Image validation failed!', 'Please select image having size less than 10 MB.');
		}
		return result;
	}

	const photoSelectHandler = () => {
		ImagePicker.openPicker({
			width: 300,
			height: 300,
			cropping: true
		}).then((image) => {
			if (validateImage(image)) {
				// console.log("Image path : " + image.path);
				setAvatarPath(image.path);
				setProfilePicture(image);
			}
		}).catch((error) => {
			showSweetAlert('warning', 'Image not selected', 'Image not selected for Profile Picture.');
		});
	}

	const photoRemoveHandler = () => {
		setAvatarPath(userAvatarLogo);
		setProfilePicture(null);
	};

	const signupHandler = () => {
		if (firstName.length < 3) {
			showSweetAlert('warning', 'Invalid Input!', 'Please enter first name greater than 3 characters to proceed.');
		}
		else if (lastName.length < 3) {
			showSweetAlert('warning', 'Invalid Input!', 'Please enter last name greater than 3 characters to proceed.');
		}
		else if (!validEmail) {
			// showSweetAlert('warning', 'Invalid Input!', 'Please enter valid email of BBD domain to proceed.');
			showSweetAlert('warning', 'Invalid Input!', 'Please enter valid email.');
		}
		else if (mobileNumber.length < 9) {
			showSweetAlert('warning', 'Invalid Input!', 'Please enter valid mobile number to proceed.');
		}
		else if (genderId == 0) {
			showSweetAlert('warning', 'Invalid Input!', 'Please select your gender to proceed.');
		}
		else if (username.length < 6) {
			showSweetAlert('warning', 'Invalid Input!', 'Please enter valid username to proceed.');
		}
		else if (!validPassword) {
			showSweetAlert('warning', 'Invalid Input!', 'Please enter valid password to proceed.');
		}
		else if (confirmPassword.length == 0) {
			showSweetAlert('warning', 'Invalid Input!', 'Please enter confirm password to proceed.');
		}
		else if (password != confirmPassword) {
			showSweetAlert('warning', 'Invalid Input!', 'Password and confirm password didn\'t match.');
		}
		else {
			setLoading(true);
			// Submitting Form Data (with Profile Picture)
			const formData = new FormData();
			formData.append('firstName', firstName);
			formData.append('lastName', lastName);
			formData.append('email', email);
			formData.append('mobileNumber', mobileNumber);
			formData.append('genderId', genderId);
			formData.append('username', username);
			formData.append('password', password);
			formData.append('availablePoints', availablePoints);
			if (profilePicture == null) {
				formData.append('profilePicture', null);
			} else {
				const picturePath = profilePicture.path;
				const pathParts = picturePath.split('/');
				formData.append('profilePicture', {
					// name: picturePath.substr(picturePath.lastIndexOf('/') + 1),
					name: pathParts[pathParts.length - 1],
					type: profilePicture.mime,
					uri: profilePicture.path
				});
			}
			const headers = { 'Content-Type': 'multipart/form-data' }
			axios.post(baseurl + '/users/register', formData, { headers })
				.then((response) => {
					setLoading(false);
					if (response.status == 201) {
						showSweetAlert('success', 'Registration Success', 'You are registered. Please wait until admin approves your account. You will receive an email, when admin will approve your account.');
						setSuccess(true);
						navigation.goBack();
						// navigator.navigate('SignInScreen');
					} else {
						showSweetAlert('error', 'Network Error', errorMessage);
					}
				})
				.catch((error) => {
					setLoading(false);
					// console.log(error);
					if (error.response) {
						// console.log(error.response.status);
						// console.log(error.response.data);
						setLoading(false);
						if (error.response.status == 404) {
							// showSweetAlert('warning', 'Username already exists.', 'Please change your username..!');
							showSweetAlert('warning', 'Invalid Username !', 'Given username already exists for another user. Please change your username.');
						} else if (error.response.status == 400) {
							// showSweetAlert('warning', 'Email already exists.', 'Please change your email..!');
							// showSweetAlert('warning', 'Email already exists.', error.response.message);
							showSweetAlert('warning', 'Invalid Email !', 'Seems that given email doesn\'t belongs to you, because user already exists with given email.');
						} else {
							showSweetAlert('error', 'Network Error', errorMessage);
						}
					} else {
						showSweetAlert('error', 'Network Error', errorMessage);
					}
				});
		}
	}

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
			<Spinner visible={loading} textContent="Loading..." animation="fade" textStyle={styles.spinnerTextStyle} />
			<TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#FFF" size={40} style={{ marginLeft: 15, marginTop: 10 }} /></TouchableOpacity>
			<View style={styles.header}>
				<Text style={styles.text_header}> Register Now!</Text>
			</View>
			<Animatable.View
				animation="fadeInUpBig"
				style={styles.footer}
			>
				<ScrollView keyboardShouldPersistTaps="handled">
					<View style={styles.avatarContainer}>
						<Avatar
							size="large"
							rounded
							source={{
								uri: avatarPath
							}}
							onPress={() => { photoSelectHandler() }}
						/>
					</View>
					<TouchableOpacity
						style={styles.buttonStyle}
						onPress={() => { photoSelectHandler() }}>
						<Text style={styles.buttonTextStyle}>
							{profilePicture == null ? "Select Profile Picture" : "Change Profile Picture"}
						</Text>
					</TouchableOpacity>
					{profilePicture &&
						(<TouchableOpacity
							style={styles.removeButtonStyle}
							onPress={() => { photoRemoveHandler() }}>
							<Text style={styles.buttonTextStyle}>Remove Profile Picture</Text>
						</TouchableOpacity>)}
					<Text style={styles.text_footer}>First Name</Text>
					<View style={styles.action}>
						<FontAwesome
							name="user-o"
							color="#05375a"
							size={20}
						/>
						<TextInput
							placeholder="Your First Name"
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => {
								setFirstName(val);
								if (val.match(name_regex) && val.length > 2)
									setValidFirstName(true);
								else
									setValidFirstName(false);
							}}
							maxLength={50}
						/>
						{validFirstName ?
							<Animatable.View
								animation="bounceIn"
							>
								<Feather
									name="check-circle"
									color="green"
									size={20}
								/>
							</Animatable.View>
							: null}
					</View>
					{(firstName.length > 0 && !validFirstName) ?
						<Animatable.View animation="fadeInLeft" duration={500}>
							<Text style={styles.errorMsg}>Firstname can only contain characters and must be greater than 2 characters.</Text>
						</Animatable.View>
						: null
					}
					<Text style={[styles.text_footer, { marginTop: 35 }]}>Last Name</Text>
					<View style={styles.action}>
						<FontAwesome
							name="user-o"
							color="#05375a"
							size={20}
						/>
						<TextInput
							placeholder="Your Last Name"
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => {
								setLastName(val);
								if (val.match(name_regex) && val.length > 2)
									setValidLastName(true);
								else
									setValidLastName(false);
							}}
							maxLength={50}
						/>
						{validLastName ?
							<Animatable.View
								animation="bounceIn"
							>
								<Feather
									name="check-circle"
									color="green"
									size={20}
								/>
							</Animatable.View>
							: null}
					</View>
					{(lastName.length > 0 && !validLastName) ?
						<Animatable.View animation="fadeInLeft" duration={500}>
							<Text style={styles.errorMsg}>Lastname can only contain characters and must be greater than 2 characters.</Text>
						</Animatable.View>
						: null
					}
					<Text style={[styles.text_footer, { marginTop: 35 }]}>Email</Text>
					<View style={styles.action}>
						<FontAwesome
							name="envelope-o"
							color="#05375a"
							size={20}
						/>
						<TextInput
							placeholder="Your Email Address"
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => {
								setEmail(val);
								// if (val.match(email_regex) && val.includes("@bbd.co.za"))
								if (val.match(email_regex))
									setValidEmail(true);
								else
									setValidEmail(false);
							}}
							keyboardType="email-address"
							maxLength={50}
						/>
						{validEmail ?
							<Animatable.View
								animation="bounceIn"
							>
								<Feather
									name="check-circle"
									color="green"
									size={20}
								/>
							</Animatable.View>
							: null}
					</View>
					{(email.length > 0 && !validEmail) ?
						<Animatable.View animation="fadeInLeft" duration={500}>
							{/* <Text style={styles.errorMsg}>Please enter valid email of BBD domain only.</Text> */}
							<Text style={styles.errorMsg}>Please enter valid email.</Text>
						</Animatable.View>
						: null
					}
					<Text style={[styles.text_footer, { marginTop: 35 }]}>Mobile Number</Text>
					<View style={styles.action}>
						<FontAwesome
							name="mobile"
							color="#05375a"
							size={20}
						/>
						<TextInput
							placeholder="Your Mobile Number"
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => setMobileNumber(val)}
							keyboardType="number-pad"
							maxLength={10}
						/>
						{mobileNumber.length > 0 && mobileNumber.length == 10 ?
							<Animatable.View
								animation="bounceIn"
							>
								<Feather
									name="check-circle"
									color="green"
									size={20}
								/>
							</Animatable.View>
							: null}
					</View>
					{(mobileNumber.length > 0 && mobileNumber.length < 9) ?
						<Animatable.View animation="fadeInLeft" duration={500}>
							<Text style={styles.errorMsg}>Please enter valid mobile number.</Text>
						</Animatable.View>
						: null
					}
					<Text style={[styles.text_footer, { marginTop: 35 }]}>Gender</Text>
					<View style={styles.action}>
						<FontAwesome
							name="mars"
							color="#05375a"
							size={20}
						/>

						{
							genderData.map((item) => (
								<View key={item.genderId} style={{ display: 'flex', flexDirection: 'row' }}>
									<TouchableOpacity
										style={styles.radioCircle}
										onPress={() => { setGenderId(item.genderId) }}>
										{genderId == item.genderId && <View style={styles.selectedRb} />}
									</TouchableOpacity>
									<Text style={{ paddingLeft: 10 }} onPress={() => { setGenderId(item.genderId) }}>{item.name}</Text>
								</View>
							))
						}

					</View>

					<Text style={[styles.text_footer, { marginTop: 35 }]}>Username</Text>
					<View style={styles.action}>
						<FontAwesome
							name="user-plus"
							color="#05375a"
							size={20}
						/>
						<TextInput
							placeholder="Your Username"
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => setUsername(val)}
							maxLength={50}
						/>
						{username.length > 0 ?
							<Animatable.View
								animation="bounceIn"
							>
								<Feather
									name="check-circle"
									color="green"
									size={20}
								/>
							</Animatable.View>
							: null}
					</View>
					{(username.length > 0 && username.length < 6) ?
						<Animatable.View animation="fadeInLeft" duration={500}>
							<Text style={styles.errorMsg}>Username must be 6 characters long.</Text>
						</Animatable.View>
						: null
					}

					<Text style={[styles.text_footer, {
						marginTop: 35
					}]}>Password</Text>
					<View style={styles.action}>
						<Feather
							name="lock"
							color="#05375a"
							size={20}
						/>
						<TextInput
							placeholder="Your Password"
							secureTextEntry={secureTextEntry ? true : false}
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => {
								setPassword(val);
								if (val.match(password_regex))
									setValidPassword(true);
								else
									setValidPassword(false);
							}}
							maxLength={50}
						/>
						<TouchableOpacity
							onPress={() => setSecureTextEntry(!secureTextEntry)}
						>
							{secureTextEntry ?
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
					{(password.length > 0 && !validPassword) ?
						<Animatable.View animation="fadeInLeft" duration={500}>
							<Text style={styles.errorMsg}>Must contain at least 1 number, 1 special character and 1 uppercase 1 lowercase letter, and at least 8 or more characters.</Text>
						</Animatable.View>
						: null
					}

					<Text style={[styles.text_footer, {
						marginTop: 35
					}]}>Confirm Password</Text>
					<View style={styles.action}>
						<Feather
							name="lock"
							color="#05375a"
							size={20}
						/>
						<TextInput
							placeholder="Confirm Your Password"
							secureTextEntry={confirmSecureTextEntry ? true : false}
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => setConfirmPassword(val)}
							maxLength={50}
						/>
						<TouchableOpacity
							onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)}
						>
							{confirmSecureTextEntry ?
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
					{(confirmPassword.length > 0 && password != confirmPassword) ?
						<Animatable.View animation="fadeInLeft" duration={500}>
							<Text style={styles.errorMsg}>Password and confirm password must match.</Text>
						</Animatable.View>
						: null
					}

					<View style={styles.button}>
						<TouchableOpacity
							onPress={() => { signupHandler() }}
							style={[styles.signIn, {
								borderColor: '#19398A',
								borderWidth: 1,
								marginTop: 15
							}]}
						>
							<Text style={[styles.textSign, {
								color: '#19398A'
							}]}>Sign Up</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.linkStyle} onPress={() => navigation.goBack()}>
							<Text style={{ color: '#19398A', marginTop: 15, fontSize: 16, textDecorationLine: 'underline' }}>&lt;- Go to Login</Text>
						</TouchableOpacity>

						{/* <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.signIn, {
                        borderColor: '#19398A',
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: '#19398A'
                    }]}>Sign In</Text>
                </TouchableOpacity> */}
					</View>
					<View style={{ marginTop: 50 }}></View>
				</ScrollView>
			</Animatable.View>
		</View>
	);
};

export default SignUpScreen;

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
		display: 'flex',
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
	radioCircle: {
		height: 20,
		width: 20,
		borderRadius: 50,
		borderWidth: 2,
		borderColor: '#3740ff',
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 30
	},
	selectedRb: {
		width: 12,
		height: 12,
		borderRadius: 50,
		backgroundColor: '#19398A',
	},
	errorMsg: {
		color: '#FF0000',
		fontSize: 14,
	},
	spinnerTextStyle: {
		color: '#FFF'
	},
	buttonStyle: {
		backgroundColor: '#19398A',
		borderWidth: 0,
		color: '#FFFFFF',
		borderColor: '#307ecc',
		height: 40,
		alignItems: 'center',
		borderRadius: 30,
		width: 200,
		alignSelf: 'center',
		// marginLeft: 80,
		// marginRight: 35,
		marginTop: 10,
		marginBottom: 15
	},
	removeButtonStyle: {
		backgroundColor: '#19398A',
		borderWidth: 0,
		color: '#FFFFFF',
		borderColor: '#307ecc',
		height: 40,
		alignItems: 'center',
		borderRadius: 30,
		width: 200,
		alignSelf: 'center',
		marginBottom: 20
	},
	buttonTextStyle: {
		color: '#FFFFFF',
		paddingVertical: 10,
		fontSize: 16,
	},
	avatarContainer: {
		display: 'flex',
		alignItems: 'center'
	},
	linkStyle: {
		marginTop: 20
	}
});