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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import showSweetAlert from '../../helpers/showSweetAlert';
import { baseurl, errorMessage } from '../../config';

// import { log } from 'react-native-reanimated';
// import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
// import Users from '../model/User';
import { AuthContext } from '../../../App';

const UpdateMatchMinBet = (props) => {
	const { loginState, logout } = useContext(AuthContext);

	const headers = { 'Authorization': 'Bearer ' + loginState.token };

	const { matchId } = props.route.params;

	const navigation = useNavigation();

	const [selectedTeamId, setSelectedTeamId] = useState(0);
	const [points, setPoints] = useState(0);
	const [oldPoints, setOldPoints] = useState(0);

	const [data, setData] = useState([]);
	const [matchData, setMatchData] = useState({});
	const [loading, setLoading] = useState(true);

	const [availablePoints, setAvailablePoints] = useState(0);
	const [tempAvailablePoints, setTempAvailablePoints] = useState(0);
	const [option, setOption] = useState('insert');
	const [betTeamId, setBetTeamId] = useState(0);

	const [refreshing, setRefreshing] = useState(false);

	const [team1BetPoints, setTeam1BetPoints] = useState(0);
	const [team2BetPoints, setTeam2BetPoints] = useState(0);

	useEffect(() => {
		fetchMatchData();
	}, []);

	const fetchMatchData = () => {
		setLoading(true);
		axios.get(baseurl + '/matches/' + matchId, { headers })
			.then(response => {
				setLoading(false);
				if (response.status == 200) {
					setMatchData(response.data);
					setPoints(response.data.minimumPoints);
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

	const updateHandler = () => {
		const current_datetime = new Date();
		const str = matchData.startDatetime;
		const matchDate = new Date(str);
		const match_date = new Date(matchDate.getUTCFullYear(), matchDate.getUTCMonth(), matchDate.getUTCDate(), matchDate.getUTCHours(), matchDate.getUTCMinutes(), matchDate.getUTCSeconds());
		if (points < 1) {
			showSweetAlert('warning', 'Invalid Points', "Please enter valid value for Minimum Bet Points.");
		}
		else if (points != parseInt(points)) {
			showSweetAlert('warning', 'Invalid Points', "Minimum Bet points must be an integer value.");
		}
		else if (match_date < current_datetime) {
			showSweetAlert('warning', 'Match time out', "Sorry, the match has already started, so minimum bet points cannot be updated now.");
		}
		else {
			setLoading(true);
			axios.put(baseurl + '/matches/' + matchId + '/update-min-points/' + points, {}, { headers })
				.then((response) => {
					setLoading(false);
					if (response.status == 200) {
						showSweetAlert('success', 'Success', "Minimum Bet Updated Successfully");
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

	return (
		<ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
			<Spinner visible={loading} textContent="Loading..." animation="fade" textStyle={styles.spinnerTextStyle} />
			<View>
				<TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#FFF" size={40} style={{ marginLeft: 15, marginTop: 10 }} /></TouchableOpacity>
				<StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
				<View style={styles.header}>
					<Text style={styles.text_header}>Update Minimum Bet Points</Text>
				</View>
				<Animatable.View
					animation="fadeInUpBig"
					style={[styles.footer, {
						backgroundColor: colors.background
					}]}
				>

					{/* <Text>Minimum Bet Points : {matchData.minimumBet}</Text> */}
					<Text style={[styles.text_footer, {
						color: '#000'
					}]}>Minimum Bet Points
            </Text>
					<View style={styles.action}>
						<FontAwesome
							name="money"
							color="#000"
							size={20}
						/>
						<TextInput
							placeholder="Minimum Bet Points"
							placeholderTextColor="#666666"
							keyboardType="numeric"
							style={[styles.textInput, {
								color: '#000'
							}]}
							onChangeText={(val) => {
								setPoints(val)
								// console.log(val);
								const betPoints = 0;
								if (val == '')
									betPoints = 0;
								else {
									betPoints = parseInt(val);
									if (isNaN(betPoints) || betPoints < 0) {
										betPoints = 0;
									}
								}
								// setTempAvailablePoints(parseInt(availablePoints) + parseInt(oldPoints) - betPoints);
								// console.log(betPoints);
							}}
							value={points + ""}
						/>
					</View>
					<View style={styles.button}>
						<TouchableOpacity
							onPress={() => { updateHandler() }}
							style={[styles.signIn, {
								borderColor: '#19398A',
								borderWidth: 1,
								// marginTop: 5
							}]}
						>
							<Text style={[styles.textSign, {
								color: '#19398A'
							}]}>
								Update
                    </Text>
						</TouchableOpacity>
					</View>
				</Animatable.View>
			</View>
		</ScrollView>
	);
}

export default UpdateMatchMinBet;

const { height } = Dimensions.get("screen");
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
		paddingBottom: 30,
		marginTop: 30
	},
	footer: {
		flex: 3,
		backgroundColor: '#fff',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingHorizontal: 10,
		paddingVertical: 20
	},
	text_header: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 30
	},
	text_footer: {
		color: '#05375a',
		fontSize: 16
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
		marginTop: 15
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
		// marginLeft:20 ,
		marginTop: 40,
		marginLeft: 5
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
		//   justifyContent: "space-between",
	},
	ellipse: {
		width: 60,
		height: 60,
		marginTop: 0,
		borderRadius: 30,
		marginLeft: 7
	},
	mI: {
		fontFamily: "roboto-regular",
		color: "#121212",
		fontSize: 18,
		marginLeft: 10,
		marginTop: 20,
		fontWeight: "bold"
	},
	rect: {
		width: '39%',
		height: 110,
		backgroundColor: "#E6E6E6",
		borderWidth: 1,
		borderColor: "#000000",
		borderRadius: 10,
		//   marginTop: 10,
		marginLeft: 8,
		display: "flex",
		flexDirection: 'column',
		//    justifyContent: 'space-between',
		marginBottom: 30
	},
	card: {
		width: '100%',
		height: 50,
		// backgroundColor: "#E6E6E6",
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
	bgLight: {
		backgroundColor: "#E6E6E6",
	},
	bgDark: {
		// backgroundColor: "#98FB98",
		backgroundColor: '#87CEFA'
	},
	text_header1: {
		color: '#000',
		fontWeight: 'bold',
		fontSize: 20,
		textAlign: 'center',
		marginTop: 30
	},
	cardlist: {
		display: "flex",
		flexDirection: "row",
		marginTop: 4,
		justifyContent: "space-between",
	},
	ellipse1: {
		width: 30,
		height: 30,
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
	},
	txtBetPoints: {
		color: '#000',
		fontWeight: 'bold',
		fontSize: 18,
		textAlign: 'center',
		marginTop: 10
	}
});