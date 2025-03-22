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
	StatusBar
} from 'react-native';
import {
	Dropdown
} from 'sharingan-rn-modal-dropdown';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';

import showSweetAlert from '../../helpers/showSweetAlert';
import { errorMessage } from '../../config';
import { AuthContext } from '../../../App';

const MatchesScreen = (props) => {
	const { loginState, logout } = useContext(AuthContext);
	let baseurl = loginState.backendUrl;

	const headers = { 'Authorization': 'Bearer ' + loginState.token };

	const { updateMatchId } = props.route.params ?? "undefined";
	const navigation = useNavigation();
	// LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
	const [data, setData] = useState([]);
	const [tournamentData, setTournamentData] = useState([]);
	const [venueData, setVenueData] = useState([]);
	const [venueId, setVenueId] = useState(0);
	const [team1Data, setTeam1Data] = useState([]);
	const [team1Id, setTeam1Id] = useState(0);
	const [team2Data, setTeam2Data] = useState([]);
	const [team2Id, setTeam2Id] = useState(0);
	const [matchId, setMatchId] = useState(0);
	const [matchName, setMatchName] = useState('');
	const [startDateTime, setStartDateTime] = useState('');
	const [minBetPoints, setMinBetPoints] = useState(0);
	const [btnText, setBtnText] = useState('Add');
	const [tournamentId, setTournamentId] = useState(0);
	const [valueSS, setValueSS] = useState('');
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		displayTournament();
		displayVenue();
		displayTeam();
		if (updateMatchId != undefined) {
			fetchMatchData(updateMatchId);
		}
		// displayTeam();
		// setPlayerType('');
	}, []);

	const displayTournament = () => {
		setLoading(true);
		axios.get(baseurl + '/tournaments', { headers })
			.then(response => {
				setLoading(false);
				//     setRefreshing(false);
				if (response.status == 200) {
					setData(response.data);
					// console.log(json.data);
					const dt = response.data;
					// console.log(dt.length);
					const arr = [];
					for (let i = 0; i < dt.length; i++) {
						arr.push({
							value: dt[i].tournamentId,
							label: dt[i].name
						});
					}
					setTournamentData(arr);
					// console.log(userData);
				}
				else {
					showSweetAlert('error', 'Network Error', errorMessage);
				}
			})
			.catch(error => {
				setLoading(false);
				// setRefreshing(false);
				showSweetAlert('error', 'Network Error', errorMessage);
				if (error.response && error.response.status === 401) {
					logout();
				}
			});
	};

	const displayVenue = () => {
		setLoading(true);
		axios.get(baseurl + '/venues', { headers })
			.then(response => {
				setLoading(false);
				// setRefreshing(false);
				if (response.status == 200) {
					setData(response.data);
					// console.log(json.data);
					const dt = response.data;
					// console.log(dt.length);
					const arr = [];
					for (let i = 0; i < dt.length; i++) {
						arr.push({
							value: dt[i].venueId,
							label: dt[i].name
						});
					}
					setVenueData(arr);
				}
				else {
					showSweetAlert('error', 'Network Error', errorMessage);
				}
			})
			.catch(error => {
				setLoading(false);
				// setRefreshing(false);
				showSweetAlert('error', 'Network Error', errorMessage);
				if (error.response && error.response.status === 401) {
					logout();
				}
			});
	};

	const displayTeam = () => {
		setLoading(true);
		axios.get(baseurl + '/teams', { headers })
			.then(response => {
				setLoading(false);
				// setRefreshing(false);
				if (response.status == 200) {
					setData(response.data);
					// console.log(json.data);
					const dt = response.data;
					// console.log(dt.length);
					const arr = [];
					for (let i = 0; i < dt.length; i++) {
						arr.push({
							value: dt[i].teamId,
							label: dt[i].shortName
						});
					}
					setTeam1Data(arr);
					setTeam2Data(arr);
				}
				else {
					showSweetAlert('error', 'Network Error', errorMessage);
				}
			})
			.catch(error => {
				setLoading(false);
				// setRefreshing(false);
				showSweetAlert('error', 'Network Error', errorMessage);
				if (error.response && error.response.status === 401) {
					logout();
				}
			});
	};

	const fetchMatchData = (matchId) => {
		setBtnText('Update');
		setLoading(true);
		axios.get(baseurl + '/matches/' + matchId, { headers })
			.then(response => {
				// setLoading(false);
				if (response.status == 200) {
					setMinBetPoints(response.data.minimumPoints);
					setMatchId(response.data.matchId);
					setMatchName(response.data.name);
					setStartDateTime(response.data.startDatetime);
					setTeam1Id(response.data.team1Id);
					setTeam2Id(response.data.team2Id);
					setVenueId(response.data.venueId);
					setTournamentId(response.data.tournamentId);
				}
				else {
					showSweetAlert('error', 'Network Error', errorMessage);
				}
				setLoading(false);
			})
			.catch(error => {
				setLoading(false);
				showSweetAlert('error', 'Network Error', errorMessage);
				if (error.response && error.response.status === 401) {
					logout();
				}
			});
	};

	const showDatePicker = () => {
		setDatePickerVisibility(true);
	};

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};
	const handleConfirm = (date) => {
		setStartDateTime(date);
		// console.log(startDateTime);
		// console.log(date);
		hideDatePicker();
	};

	const addMatch = () => {
		// console.log(data.gender);
		// console.log(baseurl+'/gender');
		if (matchId == 0) {
			showSweetAlert('warning', 'Invalid Input', 'Please enter valid Match Id.');
		}
		else if (tournamentId == 0) {
			showSweetAlert('warning', 'Invalid Input', 'Please enter valid Tournament Id.');
		}
		else if (matchName == '') {
			showSweetAlert('warning', 'Invalid Input', 'Please Select Match Name.');
		}
		else if (venueId == 0) {
			showSweetAlert('warning', 'Invalid Input', 'Please Select Venue.');
		}
		else if (team1Id == 0) {
			showSweetAlert('warning', 'Invalid Input', 'Please Select Team1.');
		}
		else if (team2Id == 0) {
			showSweetAlert('warning', 'Invalid Input', 'Please Select Team2.');
		}
		else if (minBetPoints == 0) {
			showSweetAlert('warning', 'Invalid Input', 'Please enter valid value for Minimum Bet Points.');
		}
		else if (startDateTime == '') {
			showSweetAlert('warning', 'Invalid Input', 'Please select match date time.');
		}
		else {
			setLoading(true);
			const requestData = {
				matchId: matchId,
				tournamentId: tournamentId,
				name: matchName,
				startDatetime: startDateTime,
				venueId: venueId,
				team1: team1Id,
				team2: team2Id,
				minimumPoints: minBetPoints
			};
			axios.post(baseurl + '/matches', requestData, { headers })
				.then((response) => {
					setLoading(false);
					if (response.status == 201) {
						showSweetAlert('success', 'Success', 'Match added successfully.');
					}
					else {
						showSweetAlert('error', 'Error', 'Failed to add Match. Please try again...');
					}
					setMinBetPoints(0);
					setMatchId(0);
					setMatchName('');
					setStartDateTime('');
					setTeam1Id(0);
					setTeam2Id(0);
					setTournamentId(0);
					setVenueId(0);
				})
				.catch((error) => {
					setLoading(false);
					console.log(error);
					// console.log("matchId" + matchId + " to:" + tournamentId + " date:" + startDateTime + " team1:" + team1Id + " team2:" + team2Id + " venue:" + venueId + " name:" + matchName + " Minimum Bet points:" + minBetPoints);
					showSweetAlert('error', 'Error', 'Failed to add Match. Please try again...');
					if (error.response && error.response.status === 401) {
						logout();
					}
				})
		}
	}

	const updateMatch = () => {
		if (matchId == 0) {
			showSweetAlert('warning', 'Invalid Input', 'Please enter valid Match Id.');
		}
		else if (tournamentId == 0) {
			showSweetAlert('warning', 'Invalid Input', 'Please enter valid Tournament Id.');
		}
		else if (matchName == '') {
			showSweetAlert('warning', 'Invalid Input', 'Please Select Match Name.');
		}
		else if (venueId == 0) {
			showSweetAlert('warning', 'Invalid Input', 'Please Select Venue.');
		}
		else if (team1Id == 0) {
			showSweetAlert('warning', 'Invalid Input', 'Please Select Team1.');
		}
		else if (team2Id == 0) {
			showSweetAlert('warning', 'Invalid Input', 'Please Select Team2.');
		}
		else if (minBetPoints == 0) {
			showSweetAlert('warning', 'Invalid Input', 'Please enter valid value for Minimum Bet Points.');
		}
		else if (startDateTime == '') {
			showSweetAlert('warning', 'Invalid Input', 'Please select match date time.');
		}
		else {
			setLoading(true);
			const requestData = {
				tournamentId: tournamentId,
				name: matchName,
				startDatetime: startDateTime,
				venueId: venueId,
				team1: team1Id,
				team2: team2Id,
				minimumPoints: minBetPoints
			};
			axios.put(baseurl + '/matches/' + matchId, requestData, { headers })
				.then((response) => {
					setLoading(false);
					if (response.status == 200) {
						showSweetAlert('success', 'Success', 'Match updated successfully..');
					}
					else {
						showSweetAlert('error', 'Error', 'Failed to update Match. Please try again...');
					}
					setMinBetPoints(0);
					setMatchId(0);
					setMatchName('');
					setStartDateTime('');
					setTeam1Id(0);
					setTeam2Id(0);
					setTournamentId(0);
					setVenueId(0);
					setBtnText('Add');
				})
				.catch((error) => {
					setLoading(false);
					showSweetAlert('error', 'Error', 'Failed to update Match. Please try again...');
					if (error.response && error.response.status === 401) {
						logout();
					}
				})
		}
	}
	const onChangeSS = (value) => {
		setTournamentId(value);
	};
	const onVenueSS = (value) => {
		setVenueId(value);
	};
	const onTeam1SS = (value) => {
		setTeam1Id(value);
	};
	const onTeam2SS = (value) => {
		setTeam2Id(value);
	};
	return (
		<View style={styles.container}>
			<Spinner visible={loading} textContent="Loading..." animation="fade" textStyle={styles.spinnerTextStyle} />
			<StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
			<TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#FFF" size={40} style={{ marginLeft: 15, marginTop: 10 }} /></TouchableOpacity>
			<StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
			<View style={styles.header}>
				<Text style={styles.text_header}>Add Match</Text>
			</View>

			<Animatable.View
				animation="fadeInUpBig"
				style={styles.footer}
			>
				<ScrollView keyboardShouldPersistTaps="handled">
					<Text style={[styles.text_footer, { marginTop: 35 }]}>Match Id</Text>
					<View style={styles.action}>
						<TextInput
							placeholder="Enter Match Id"
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => setMatchId(val)}
							value={matchId + ""}
							maxLength={20}
						/>
						{(matchId != 0) ?
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
					<Text style={[styles.text_footer, { marginTop: 35 }]}>Tournament Name</Text>
					<View style={styles.action}>
						{/* <FontAwesome 
                    name="mars"
                    color="#05375a"
                    size={20}
                /> */}
						<Dropdown
							label="Tournament Name"
							data={tournamentData}
							enableSearch
							value={tournamentId}
							onChange={onChangeSS}
						/>
					</View>
					<Text style={[styles.text_footer, { marginTop: 35 }]}>Match Name</Text>
					<View style={styles.action}>
						<TextInput
							placeholder="Enter Match Name"
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => setMatchName(val)}
							value={matchName}
							maxLength={100}
						/>
						{(matchName != '') ?
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
					<Text style={[styles.text_footer, { marginTop: 35 }]}>Match Start Date</Text>
					<View style={styles.action}>
						<TextInput
							placeholder="Date Time"
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => setStartDateTime(val)}
							value={startDateTime + ""}
							maxLength={20}
						/>
						<TouchableOpacity onPress={showDatePicker}>
							<Animatable.View
								animation="bounceIn"
							>
								<Feather
									name="calendar"
									color="#19398A"
									size={30}
								/>
							</Animatable.View>
						</TouchableOpacity>
						<DateTimePickerModal
							isVisible={isDatePickerVisible}
							mode="date"
							onConfirm={handleConfirm}
							onCancel={hideDatePicker}
						/>
					</View>
					<Text style={[styles.text_footer, { marginTop: 35 }]}>Venue</Text>
					<View style={styles.action}>
						<Dropdown
							label="Venue Name"
							data={venueData}
							enableSearch
							value={venueId}
							onChange={onVenueSS}
						/>
					</View>
					<Text style={[styles.text_footer, { marginTop: 35 }]}>Team 1</Text>
					<View style={styles.action}>
						<Dropdown
							label="Team1"
							data={team1Data}
							enableSearch
							value={team1Id}
							onChange={onTeam1SS}
						/>
					</View>
					<Text style={[styles.text_footer, { marginTop: 35 }]}>Team 2</Text>
					<View style={styles.action}>
						<Dropdown
							label="Team1"
							data={team2Data}
							enableSearch
							value={team2Id}
							onChange={onTeam2SS}
						/>
					</View>
					<Text style={[styles.text_footer, { marginTop: 35 }]}>Minimum Bet Points</Text>
					<View style={styles.action}>
						<TextInput
							placeholder="Enter minimum Bet Points"
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => setMinBetPoints(val)}
							value={minBetPoints + ""}
							maxLength={20}
						/>
						{(minBetPoints != 0) ?
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
					<View style={styles.button}>
						<TouchableOpacity
							onPress={(btnText == 'Add') ? addMatch : updateMatch}
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
				</ScrollView>
			</Animatable.View>
		</View>
	);
};

export default MatchesScreen;

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
	},
	spinnerTextStyle: {
		color: '#FFF'
	}
});