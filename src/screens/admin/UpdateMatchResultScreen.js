import React, { useState, useEffect, useContext } from 'react';
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
	RefreshControl,
	SafeAreaView,
	FlatList,
	ScrollView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
// import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Card } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';

import showSweetAlert from '../../helpers/showSweetAlert';
import { baseurl, errorMessage } from '../../config';
import axios from 'axios';
import { AuthContext } from '../../../App';

const UpdateMatchResultScreen = (props) => {
	const { loginState, logout } = useContext(AuthContext);

	const headers = { 'Authorization': 'Bearer ' + loginState.token };

	const navigation = useNavigation();
	const { matchId, setParentRefreshing } = props.route.params;

	const [selectedTeamId, setSelectedTeamId] = useState(0);

	const [data, setData] = useState({});
	const [loading, setLoading] = useState(true);

	const [option, setOption] = useState('insert');

	const [winnerTeamId, setWinnerTeamId] = useState(-2);
	// const [resultStatus, setResultStatus] = useState(1);

	// const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = () => {
		// console.log("MatchId : " + matchId);
		setLoading(true);
		axios.get(baseurl + '/matches/' + matchId, { headers })
			.then(response => {
				setLoading(false);
				if (response.status == 200) {
					setData(response.data);
					// console.log(response.data);
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


	const { colors } = useTheme();

	const updateMatchResult = () => {
		if (winnerTeamId == -2) {
			showSweetAlert('warning', 'Invalid Selection', "Please select any one to update the match result.");
		} else {
			setLoading(true);
			// showConfirmAlert('warning', 'Confirmation', "Do you really want to update the match result ?");
			let resultstatus = 1;
			let myWinnerTeamId = winnerTeamId;
			if (winnerTeamId == 0){
				resultstatus = 0;
			}
			else if (winnerTeamId == -1){
				resultstatus = 2;
				// winnerTeamId = 0;
				myWinnerTeamId = 0;
			}
			axios.put(baseurl + '/matches/update-match/' + matchId + '/' + resultstatus + '/' + myWinnerTeamId, {}, { headers })
				.then((response) => {
					setLoading(false);
					if (response.status == 200) {
						// showSweetAlert('success', 'Match result updated successfully', "Points will be allocated to the winners shortly.");
						showSweetAlert('success', 'Match result updated successfully', "Points are allocated to the winners.");
						setParentRefreshing(true);
						navigation.goBack();
					}
					else {
						showSweetAlert('error', 'Error', 'Something went wrong. Please try again after sometime...');
					}
				})
				.catch((error) => {
					setLoading(false);
					showSweetAlert('error', 'Error', 'Something went wrong. Please try again after sometime...');
					if (error.response && error.response.status === 401) {
						logout();
					}
				})
		}
	}

	const getConfirmation = () => {
		if (winnerTeamId == -2) {
			showSweetAlert('warning', 'Invalid Selection', "Please select any one to update the match result.");
			return;
		}
		let str = 'unknown';
		if (winnerTeamId == 0)
			str = 'Draw';
		else if (winnerTeamId == -1)
			str = 'Cancelled';
		else{
			if(winnerTeamId == data.team1Id)
				str = data.team1Short;
			else if(winnerTeamId == data.team2Id)
				str = data.team2Short;
		}
		Alert.alert(
			"Match Result Update",
			`Do you really want to set the match result to "${str}" ?`,
			[
				{
					text: "Cancel",
					// onPress: () => console.log("Cancel Pressed"),
					// style: "cancel"
				},
				{
					text: "OK",
					onPress: updateMatchResult
				}
			]
		);
	}

	return (
		<ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
			<Spinner visible={loading} textContent="Loading..." animation="fade" textStyle={styles.spinnerTextStyle} />
			<StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
			<View style={styles.container}>
				<TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#FFF" size={40} style={{ marginLeft: 15, marginTop: 10 }} /></TouchableOpacity>
				<View style={styles.header}>
					{/* <Text style={styles.text_header}>Update Match Result</Text> */}
					<Text style={styles.text_header}>Set Match Result</Text>
				</View>
				<Animatable.View
					animation="fadeInUpBig"
					style={[styles.footer, {
						backgroundColor: colors.background
					}]}
				>
					<View style={styles.action}>
						<TouchableOpacity
							style={styles.radioCircle}
							onPress={() => { setWinnerTeamId(data.team1Id) }}>
							{winnerTeamId == data.team1Id && <View style={styles.selectedRb} />}
						</TouchableOpacity>
						<TouchableOpacity style={styles.rect} onPress={() => setWinnerTeamId(data.team1Id)}>
							<View style={styles.ellipseRow}>
								<Card.Image style={styles.ellipse} source={{ uri: data.team1Logo }} />
								<Text style={styles.mI}>{data.team1Short}</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.radioCircle}
							onPress={() => { setWinnerTeamId(data.team2Id) }}>
							{winnerTeamId == data.team2Id && <View style={styles.selectedRb} />}
						</TouchableOpacity>
						<TouchableOpacity style={styles.rect} onPress={() => { setWinnerTeamId(data.team2Id) }}>
							<View style={styles.ellipseRow}>
								<Card.Image style={styles.ellipse} source={{ uri: data.team2Logo }} />
								<Text style={styles.mI}>{data.team2Short}</Text>
							</View>
						</TouchableOpacity>
					</View>
					<View style={styles.action}>
						<TouchableOpacity
							style={styles.radioCircle}
							onPress={() => { setWinnerTeamId(0) }}>
							{winnerTeamId == 0 && <View style={styles.selectedRb} />}
						</TouchableOpacity>
						<TouchableOpacity style={styles.rect} onPress={() => setWinnerTeamId(0)}>
							<View style={styles.ellipseRow}>
								<Text style={styles.mI}>Draw</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.radioCircle}
							onPress={() => { setWinnerTeamId(-1) }}>
							{winnerTeamId == -1 && <View style={styles.selectedRb} />}
						</TouchableOpacity>
						<TouchableOpacity style={styles.rect} onPress={() => setWinnerTeamId(-1)}>
							<View style={styles.ellipseRow}>
								<Text style={styles.mI}>Cancelled</Text>
							</View>
						</TouchableOpacity>
					</View>

					<View style={styles.button}>
						<TouchableOpacity
							onPress={getConfirmation}
							style={[styles.signIn, {
								borderColor: '#19398A',
								borderWidth: 1,
								// marginTop: 5
							}]}
						>
							<Text style={[styles.textSign, {
								color: '#19398A'
							}]}>Set Match Result</Text>
						</TouchableOpacity>
					</View>
				</Animatable.View>
			</View>
		</ScrollView>
	);
};

export default UpdateMatchResultScreen;

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
		// marginTop: 10,
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
	radioCircle: {
		height: 30,
		width: 30,
		borderRadius: 100,
		borderWidth: 2,
		borderColor: '#3740ff',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 30,
		marginLeft: 10
	},
	selectedRb: {
		width: 20,
		height: 20,
		borderRadius: 50,
		backgroundColor: '#19398A',
	},
	ellipseRow: {
		// height: 95,
		display: "flex",
		flexDirection: "row",
		marginTop: 8,
		//   marginLeft: 25,
		// alignSelf: "flex-start"
		// flex: 4,
		justifyContent: "space-between",
	},
	ellipse: {
		width: 61,
		height: 61,
		marginTop: 0,
		borderRadius: 30,
		marginLeft: 7
	},
	mI: {
		fontFamily: "roboto-regular",
		color: "#121212",
		fontSize: 20,
		marginLeft: 11,
		marginTop: 20,
		fontWeight: "bold"
	},
	rect: {
		width: '35%',
		height: 80,
		backgroundColor: "#E6E6E6",
		borderWidth: 1,
		borderColor: "#000000",
		borderRadius: 10,
		//   marginTop: 10,
		marginLeft: 8,
		display: "flex",
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 50
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
		//  marginBottom:50
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
		marginLeft: 5,
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
		justifyContent: 'space-between',
		//    textAlign: 'center'
	},
	spinnerTextStyle: {
		color: '#FFF'
	}
});