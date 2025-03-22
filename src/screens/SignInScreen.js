import React, { useContext } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	Platform,
	StyleSheet,
	StatusBar,
	Alert,
	Dimensions,
	ScrollView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
// import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import { useTheme } from 'react-native-paper';
import { errorMessage } from '../config';
import showSweetAlert from '../helpers/showSweetAlert';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

import { AuthContext } from '../../App';
// import { ScrollView } from 'react-native-gesture-handler';

const SignInScreen = ({ navigation }) => {
	const { login } = React.useContext(AuthContext);
	let baseurl = loginState.backendUrl;

	const [data, setData] = React.useState({
		username: '',
		password: '',
		check_textInputChange: false,
		secureTextEntry: true,
		isValidUser: true,
		isValidPassword: true,
	});

	const [loading, setLoading] = React.useState(false);

	const { colors } = useTheme();

	const textInputChange = (val) => {
		if (val.trim().length >= 4) {
			setData({
				...data,
				username: val,
				check_textInputChange: true,
				isValidUser: true
			});
		} else {
			setData({
				...data,
				username: val,
				check_textInputChange: false,
				isValidUser: false
			});
		}
	}

	const handlePasswordChange = (val) => {
		if (val.trim().length >= 8) {
			setData({
				...data,
				password: val,
				isValidPassword: true
			});
		} else {
			setData({
				...data,
				password: val,
				isValidPassword: false
			});
		}
	}

	const updateSecureTextEntry = () => {
		setData({
			...data,
			secureTextEntry: !data.secureTextEntry
		});
	}

	const handleValidUser = (val) => {
		if (val.trim().length >= 4) {
			setData({
				...data,
				isValidUser: true
			});
		} else {
			setData({
				...data,
				isValidUser: false
			});
		}
	}

	const loginHandle = () => {

		if (data.username.length == 0 || data.password.length == 0) {
			// Alert.alert('Wrong Input!', 'Username or password field cannot be empty.', [
			//     {text: 'Okay'}
			// ]);
			showSweetAlert('warning', 'Wrong Input!', 'Username or password field cannot be empty.');
			return;
		}

		// New API
		setLoading(true);
		const requestData = {
			username: data.username,
			password: data.password
		};
		axios.post(baseurl + '/users/authenticate', requestData)
			.then((response) => {
				// console.log(response.data);
				setLoading(false);
				if (response.status == 200) {
					login(response.data.userId, response.data.username, response.data.role, response.data.token);
				}
			})
			.catch((error) => {
				setLoading(false);
				// console.log(error);
				if (error.response) {
					const response = error.response;
					// console.log(response);
					if (response.status == 400 || response.status == 401) {
						showSweetAlert('warning', 'Login Failed !', response.data.message);
					} else {
						showSweetAlert('error', 'Network Error', errorMessage);
					}
				} else {
					showSweetAlert('error', 'Network Error', errorMessage);
				}
			});
	}

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
			<Spinner visible={loading} textContent="Loading..." animation="fade" textStyle={styles.spinnerTextStyle} />
			<View style={styles.header}>
				<Text style={styles.text_header}>SportsGeek Login!</Text>
			</View>
			<Animatable.View
				animation="fadeInUpBig"
				style={[styles.footer, {
					backgroundColor: colors.background
				}]}
			>
				<ScrollView keyboardShouldPersistTaps="handled">
					<Text style={[styles.text_footer, {
						color: '#000'
					}]}>Username</Text>
					<View style={styles.action}>
						<FontAwesome
							name="user-o"
							color="#000"
							size={20}
						/>
						<TextInput
							placeholder="Your Username"
							placeholderTextColor="#666666"
							style={[styles.textInput, {
								color: '#000'
							}]}
							autoCapitalize="none"
							onChangeText={(val) => textInputChange(val)}
							onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
							maxLength={50}
						/>
						{data.check_textInputChange ?
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
					{data.isValidUser ? null :
						<Animatable.View animation="fadeInLeft" duration={500}>
							<Text style={styles.errorMsg}>Username must be 4 characters long.</Text>
						</Animatable.View>
					}


					<Text style={[styles.text_footer, {
						color: '#000',
						marginTop: 35
					}]}>Password</Text>
					<View style={styles.action}>
						<Feather
							name="lock"
							color='#000'
							size={20}
						/>
						<TextInput
							placeholder="Your Password"
							placeholderTextColor="#666666"
							secureTextEntry={data.secureTextEntry ? true : false}
							style={[styles.textInput, {
								color: '#000'
							}]}
							autoCapitalize="none"
							onChangeText={(val) => handlePasswordChange(val)}
							maxLength={50}
						/>
						<TouchableOpacity
							onPress={updateSecureTextEntry}
						>
							{data.secureTextEntry ?
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
					{data.isValidPassword ? null :
						<Animatable.View animation="fadeInLeft" duration={500}>
							<Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
						</Animatable.View>
					}
					<TouchableOpacity onPress={() => navigation.navigate('ForgetPasswordScreen')}>
						<Text style={{ color: '#19398A', marginTop: 15, fontSize: 16, textDecorationLine: 'underline' }}>Forget password?</Text>
					</TouchableOpacity>
					<View style={styles.button}>
						<TouchableOpacity
							onPress={() => { loginHandle() }}
							style={[styles.signIn, {
								borderColor: '#19398A',
								borderWidth: 1,
								marginTop: 10
							}]}
						>
							<Text style={[styles.textSign, {
								color: '#19398A'
							}]}>Login</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.linkStyle} onPress={() => navigation.navigate('SignUpScreen')}>
							<Text style={{ color: '#19398A', marginTop: 15, fontSize: 16, textDecorationLine: 'underline' }}>Don't have an account? Sign Up</Text>
						</TouchableOpacity>
					</View>
					<View style={{ marginTop: 50 }}></View>
				</ScrollView>
			</Animatable.View>
		</View>
	);
};

export default SignInScreen;

// const {height} = Dimensions.get("screen");
const styles = StyleSheet.create({
	container: {
		width: '100%',
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
		flex: 3,
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
	actionError: {
		flexDirection: 'row',
		marginTop: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#FF0000',
		paddingBottom: 5
	},
	textInput: {
		flex: 1,
		marginTop: Platform.OS === 'ios' ? 0 : -12,
		paddingLeft: 10,
		color: '#05375a',
	},
	errorMsg: {
		color: '#FF0000',
		fontSize: 14,
	},
	button: {
		alignItems: 'center',
		marginTop: 30
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
	spinnerTextStyle: {
		color: '#FFF'
	},
	linkStyle: {
		marginTop: 20
	}
});