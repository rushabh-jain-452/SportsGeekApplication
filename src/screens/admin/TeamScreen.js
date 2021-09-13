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
	RefreshControl,
	Image,
	Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import showSweetAlert from '../../helpers/showSweetAlert';
import { baseurl, errorMessage } from '../../config';
import { Card } from 'react-native-elements';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-crop-picker';
import { AuthContext } from '../../../App';

const TeamScreen = ({ navigation }) => {
	const { loginState, logout } = useContext(AuthContext);

	const headers = { 'Authorization': 'Bearer ' + loginState.token };

	const userAvatarLogo = 'https://firebasestorage.googleapis.com/v0/b/sportsgeek-74e1e.appspot.com/o/69bba4a0-c114-4379-9854-e4381a3130bc.png?alt=media&token=e9924ea4-c2d9-4782-bc2d-0fe734431c86';

	LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
	const [data, setData] = useState([]);
	const [team, setTeam] = useState('');
	const [btnText, setBtnText] = useState('Add');
	const [teamId, setTeamId] = useState(0);
	const [shortName, setShortName] = useState('');
	const [teamLogo, setTeamLogo] = useState(null);
	const [avatarPath, setAvatarPath] = useState(userAvatarLogo);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		displayTeam();
		// setTeam('');
		// setTeamLogo('');
		// setShortName('');
		clearControls();
	}, [refreshing]);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		displayTeam();
		// setTeam('');
		// setTeamLogo('');
		// setShortName('');
		clearControls();
	}, []);

	const clearControls = () => {
		setTeam('');
		setTeamLogo(null);
		setShortName('');
	}

	const displayTeam = () => {
		setLoading(true);
		axios.get(baseurl + '/teams', { headers })
			.then(response => {
				setLoading(false);
				setRefreshing(false);
				if (response.status == 200) {
					setData(response.data);
				}
				else {
					showSweetAlert('error', 'Network Error', errorMessage);
				}
			})
			.catch(error => {
				setLoading(false);
				setRefreshing(false);
				showSweetAlert('error', 'Network Error', errorMessage);
				if (error.response && error.response.status === 401) {
					logout();
				}
			})
	}

	const photoSelectHandler = () => {
		ImagePicker.openPicker({
			width: 300,
			height: 300,
			cropping: true
		}).then((image) => {
			if (validateImage(image)) {
				setAvatarPath(image.path);
				setTeamLogo(image);
			}
		}).catch((error) => {

			showSweetAlert('warning', 'Image not selected', 'Image not selected for team Logo.');
		});
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

	const photoRemoveHandler = () => {
		setAvatarPath(userAvatarLogo);
		setTeamLogo(null);
	};

	const addTeam = () => {
		if (team.length < 3) {
			showSweetAlert('warning', 'Invalid Input!', 'Please enter Team name greater than 3 characters to proceed.');
		}
		else if (shortName.length < 2) {
			showSweetAlert('warning', 'Invalid Input!', 'Please enter Short name greater than 2 characters to proceed.');
		}
		else if (!teamLogo) {
			showSweetAlert('warning', 'Invalid Input!', 'Please Select Team logo.');
		}
		else {
			setLoading(true);
			// Submitting Form Data (with Profile Picture)
			const formData = new FormData();
			formData.append('name', team);
			formData.append('shortName', shortName);
			if (teamLogo == null) {
				formData.append('teamLogo', null);
			} else {
				const picturePath = teamLogo.path;
				const pathParts = picturePath.split('/');
				formData.append('teamLogo', {
					// name: picturePath.substr(picturePath.lastIndexOf('/') + 1),
					name: pathParts[pathParts.length - 1],
					type: teamLogo.mime,
					uri: teamLogo.path
				});
			}
			const headers = { 'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + loginState.token };
			axios.post(baseurl + '/teams', formData, { headers })
				.then((response) => {
					setLoading(false);
					if (response.status == 201) {
						showSweetAlert('success', 'Success', 'Team added successfully.');
						setSuccess(true);
						// navigation.goBack();
						// navigator.navigate('SignInScreen');
					} else {
						showSweetAlert('error', 'Network Error', errorMessage);
					}
					// setTeam('');
					// setShortName('');
					// setTeamLogo(null);
					clearControls();
					setAvatarPath(avatarPath);
					displayTeam();
				})
				.catch((error) => {
					setLoading(false);
					// console.log(error);
					showSweetAlert('error', 'Network Error', errorMessage);
					if (error.response && error.response.status === 401) {
						logout();
					}
				});
		}
	}
	const getConfirmation = (teamId) =>
		Alert.alert(
			"Delete Confirmation",
			"Do you really want to delete the Team ?",
			[
				{
					text: "Cancel"
				},
				{
					text: "OK",
					onPress: () => { deleteTeam(teamId) }
				}
			]
		);

	const deleteTeam = (id) => {
		setLoading(true);
		axios.delete(baseurl + '/teams/' + id, { headers })
			.then((response) => {
				setLoading(false);
				if (response.status == 200) {
					showSweetAlert('success', 'Success', 'Team deleted successfully.');
					displayTeam();
				}
				else {
					showSweetAlert('error', 'Error', 'Failed to delete Team. Please try again...');
				}
				// setTeam('');
				// setTeamLogo('');
				// setShortName('');
				clearControls();
				displayTeam();
			})
			.catch((error) => {
				// console.log(error);
				setLoading(false);
				showSweetAlert('error', 'Error', 'Failed to delete Team. Please try again...');
				if (error.response && error.response.status === 401) {
					logout();
				}
			})
	}

	const editTeam = (teamId, name, shortName, teamLogo) => {
		setTeam(name);
		setBtnText('Update');
		setTeamId(teamId);
		setTeamLogo(null);
		setShortName(shortName);
		setAvatarPath(teamLogo);
	}

	const updateTeam = () => {
		if (team.length < 3) {
			showSweetAlert('warning', 'Invalid Input!', 'Please enter Team name greater than 3 characters to proceed.');
		}
		else if (shortName.length < 2) {
			showSweetAlert('warning', 'Invalid Input!', 'Please enter Short name greater than 2 characters to proceed.');
		}
		else if (!teamLogo) {
			showSweetAlert('warning', 'Invalid Input!', 'Please Select Team logo.');
		}
		else {
			setLoading(true);
			const formData = new FormData();
			formData.append('name', team);
			formData.append('shortName', shortName);
			if (teamLogo == null) {
				formData.append('teamLogo', null);
			} else {
				// console.log("TeamLogo:" + teamLogo.path);
				const picturePath = teamLogo.path;
				const pathParts = picturePath.split('/');
				formData.append('teamLogo', {
					// name: picturePath.substr(picturePath.lastIndexOf('/') + 1),
					name: pathParts[pathParts.length - 1],
					type: teamLogo.mime,
					uri: teamLogo.path
				});
			}
			const headers = { 'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + loginState.token };
			axios.put(baseurl + '/teams/' + teamId, formData, { headers })
				.then((response) => {
					setLoading(false);
					if (response.status == 200) {
						setSuccess(true);
						showSweetAlert('success', 'Success', 'Team updated successfully..');
					}
					else {
						showSweetAlert('error', 'Error', 'Failed to update Team. Please try again...');
					}
					// setTeam('');
					// setShortName('');
					// // setTeamLogo(null);
					// setTeamLogo('');
					clearControls();
					setBtnText('Add');
					setAvatarPath(avatarPath);
					displayTeam();
				})
				.catch((error) => {
					setLoading(false);
					console.log(error);
					showSweetAlert('error', 'Error', 'Failed to update Team. Please try again...');
					if (error.response && error.response.status === 401) {
						logout();
					}
				})
		}
	}
	return (
		<View style={styles.container}>
			<Spinner visible={loading} textContent="Loading..." animation="fade" textStyle={styles.spinnerTextStyle} />
			<StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
			<TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#FFF" size={40} style={{ marginLeft: 20, marginTop: 10, width: 100 }} /></TouchableOpacity>
			<View style={styles.header}>
				<Text style={styles.text_header}>Team Details</Text>
			</View>
			<Animatable.View
				animation="fadeInUpBig"
				style={styles.footer}
			>
				<ScrollView keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
					<Text style={[styles.text_footer, { marginTop: 35 }]}>Team Name</Text>
					<View style={styles.action}>
						<FontAwesome
							name="keyboard-o"
							color="#05375a"
							size={20}
						/>
						<TextInput
							placeholder="Enter Team Name"
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => setTeam(val)}
							value={team}
							maxLength={20}
						/>
						{(team != '') ?
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
					<Text style={[styles.text_footer, { marginTop: 35 }]}>Team Short Name</Text>
					<View style={styles.action}>
						<FontAwesome
							name="keyboard-o"
							color="#05375a"
							size={20}
						/>
						<TextInput
							placeholder="Enter Team Short Name"
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => setShortName(val)}
							value={shortName}
							maxLength={20}
						/>
						{(shortName != '') ?
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
					<Text style={[styles.text_footer, { marginTop: 35 }]}>Team Logo</Text>
					<View style={styles.imageUploadCard}>
						<Card.Image style={styles.imageuploadStyle} source={{ uri: avatarPath }} />
						<TouchableOpacity
							style={styles.buttonStyle}
							onPress={() => { photoSelectHandler() }}>
							<Text style={styles.buttonTextStyle}>
								{teamLogo == null ? <Icon name="account-check" color="#19398A" size={50} /> : <Icon name="account-edit" color="#19398A" size={50} />}
							</Text>
						</TouchableOpacity>
						{teamLogo != null &&
							(<TouchableOpacity
								// style={styles.removeButtonStyle}
								onPress={() => { photoRemoveHandler() }}>
								<Text style={styles.buttonTextStyle1}><Icon name="account-cancel" color="#19398A" size={50} /></Text>
							</TouchableOpacity>)}
					</View>

					<View style={styles.button}>
						<TouchableOpacity
							onPress={(btnText == 'Add') ? addTeam : updateTeam}
							style={[styles.signIn, {
								borderColor: '#19398A',
								borderWidth: 1,
								marginTop: 10,
								marginBottom: 20
							}]}
						>
							<Text style={[styles.textSign, {
								color: '#19398A'
							}]}>{btnText}</Text>
						</TouchableOpacity>
					</View>
					{
						data.map((item, index) => (
							<View style={styles.card} key={item.teamId} >
								<View style={styles.cardlist}>
									<View>
										<Card.Image style={styles.ellipse1} source={{ uri: item.teamLogo }} />
										{/* <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>{(item.name).substr(0,1)}</Text> */}
									</View>
									<Text style={[styles.carditem, { width: '15%', paddingLeft: 20 }]}>{item.shortName}</Text>
									<Text style={[styles.carditem, { width: '50%', paddingLeft: 20 }]}>{item.name}</Text>
									<TouchableOpacity onPress={() => { editTeam(item.teamId, item.name, item.shortName, item.teamLogo) }} style={{ width: '10%' }}><Text style={[styles.carditem]}><Icon name="circle-edit-outline" color="#19398A" size={30} /></Text></TouchableOpacity>
									<TouchableOpacity onPress={() => { getConfirmation(item.teamId) }} style={{ width: '10%' }}><Text style={[styles.carditem]}><Icon name="delete-circle-outline" color="#19398A" size={30} /></Text></TouchableOpacity>
								</View>
							</View>
						))
					}

				</ScrollView>
			</Animatable.View>
		</View>
	);
};

export default TeamScreen;

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
		//   backgroundColor: '#e9c46a'
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
	imageUploadCard: {
		width: '100%',
		height: 120,
		backgroundColor: "#D5DBDB",
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
	imageuploadStyle: {
		width: 100,
		height: 100,
		marginTop: 7,
		borderRadius: 80,
		marginLeft: '45%',
		justifyContent: 'center',
		//   backgroundColor: 'white'
	},
	buttonTextStyle: {
		color: '#FFFFFF',
		paddingVertical: 5,
		fontSize: 16,
	},
	buttonTextStyle1: {
		color: '#FFFFFF',
		// paddingHorizontal:20,
		paddingVertical: 5,
		fontSize: 16,
	},
	// buttonStyle: {
	//     backgroundColor: '#19398A',
	//     borderWidth: 0,
	//     color: '#FFFFFF',
	//     borderColor: '#307ecc',
	//     height: 40,
	//     alignItems: 'center',
	//     borderRadius: 30,
	//     width: 30,
	//     alignSelf: 'center',
	//     // marginLeft: 80,
	//     // marginRight: 35,
	//     marginTop: 10,
	//     marginBottom: 15
	// },
	spinnerTextStyle: {
		color: '#FFF'
	}
});