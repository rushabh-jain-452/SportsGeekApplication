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
	ActivityIndicator,
	RefreshControl,
	SafeAreaView,
	FlatList,
	ScrollView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
// import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Card, colors } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import { Avatar } from "react-native-elements";
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import { AuthContext } from '../../App';

import getColor from '../helpers/getColor';
import { formatDate } from '../helpers/dateFunctions';
import showSweetAlert from '../helpers/showSweetAlert';
import { baseurl, errorMessage } from '../config';

const ContestScreen = (props) => {
	const { loginState, logout } = useContext(AuthContext);
	const userId = loginState.userId;
	const username = loginState.username;

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
	const [contestId, setContestId] = useState(0);

	const [refreshing, setRefreshing] = useState(false);
	const [waiting, setWaiting] = React.useState(true);

	const [team1BetPoints, setTeam1BetPoints] = useState(0);
	const [team2BetPoints, setTeam2BetPoints] = useState(0);

	const [team1NoOfBets, setTeam1NoOfBets] = useState(0);
	const [team2NoOfBets, setTeam2NoOfBets] = useState(0);

	const [sortColumn, setSortColumn] = useState('');
	const [sortOrder, setSortOrder] = useState(1);  // 1 = ASC and -1 = DESC

	useEffect(() => {
		checkUserContest();
		fetchUserData();
		fetchMatchData();
		// fetchData(token);
	}, [refreshing]);

	const checkUserContest = () => {
		axios.get(baseurl + '/users/' + userId + '/contest/' + matchId, { headers })
			.then((response) => {
				if (response.status == 200) {
					setPoints(response.data.contestPoints);
					setOldPoints(response.data.contestPoints);
					// console.log('checkUserContest : ' + typeof(json.data.contestPoints));
					// console.log(typeof(json.data.contestPoints));
					// console.log(json.data.contestPoints);
					setSelectedTeamId(response.data.teamId);
					setContestId(response.data.contestId);
					setOption('update');
				} else {
					setOldPoints(0);
				}
			})
			.catch((error) => {
				setOldPoints(0);
				// const response = error.message;
				// console.log('Error 1');
				// console.log(error);
				// showSweetAlert('error', 'Network Error', errorMessage);
				if (error.response && error.response.status === 401) {
					logout();
				}
			});
	}

	// Contest data
	const fetchData = (matchData) => {
		setLoading(true);
		// console.log(baseurl + '/matches/' + matchId + '/contest');
		axios.get(baseurl + '/matches/' + matchId + '/contest', { headers })
			.then((response) => {
				setLoading(false);
				setRefreshing(false);
				setWaiting(false);
				if (response.status == 200) {
					setData(response.data);
					// console.log(response.data);
					const records = response.data;
					let team1points = 0, team2points = 0;
					let team1bets = 0, team2bets = 0;
					// console.log(records);
					// console.log(matchData.team1Id);
					// console.log(matchData.team2Id);
					records.forEach((item) => {
						if (item.teamShortName == matchData.team1Short) {
							team1bets++;
							team1points += item.contestPoints;
						} else if (item.teamShortName == matchData.team2Short) {
							team2bets++;
							team2points += item.contestPoints;
						}
					});
					// console.log(team1points + ' ' + team2points);
					setTeam1BetPoints(team1points);
					setTeam2BetPoints(team2points);
					setTeam1NoOfBets(team1bets);
					setTeam2NoOfBets(team2bets);
				} else {
					// console.log('Error 2');
					// console.log(error);
					showSweetAlert('error', 'Network Error', errorMessage);
				}
			})
			.catch((error) => {
				setLoading(false);
				setRefreshing(false);
				setWaiting(false);
				// console.log('Error 2');
				// console.log(error);
				showSweetAlert('error', 'Network Error', errorMessage);
				if (error.response && error.response.status === 401) {
					logout();
				}
			});
	}

	// Matches Data
	const fetchMatchData = () => {
		axios.get(baseurl + '/matches/' + matchId, { headers })
			.then((response) => {
				if (response.status == 200) {
					setMatchData(response.data);
					fetchData(response.data);
				} else {
					setMatchData([]);
				}
			})
			.catch((error) => {
				// console.log('Error 3');
				showSweetAlert('error', 'Network Error', errorMessage);
				if (error.response && error.response.status === 401) {
					logout();
				}
			})
	}

	// User data
	const fetchUserData = () => {
		axios.get(baseurl + '/users/' + userId, { headers })
			.then((response) => {
				if (response.status == 200) {
					setAvailablePoints(response.data.availablePoints);
					setTempAvailablePoints(response.data.availablePoints);
				} else {
					showSweetAlert('warning', 'Unable to fetch data!', 'Unable to fetch User\'s available points. Please try again after sometime.');
				}
			})
			.catch((error) => {
				// console.log('Error 4');
				showSweetAlert('error', 'Network Error', errorMessage);
				if (error.response && error.response.status === 401) {
					logout();
				}
			})
	}

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		// fetchData();
		// fetchMatchData();
		// fetchUserData();
	}, []);

	const contestHandler = () => {
		const current_datetime = new Date();
		const str = matchData.startDatetime;
		// let match_datetime = new Date(str);
		// console.log('MatchDatetime : ' + str);
		// console.log('Match Date : ' + match_datetime.toISOString());
		// console.log('Match Date toString : ' + match_datetime.toString());
		// console.log('Formatted : ' + match_datetime.getDate() + '/' + ( match_datetime.getMonth()+1) + '/' + match_datetime.getFullYear());
		// console.log('UTC : ' + match_datetime.getUTCDate() + '/' + (match_datetime.getUTCMonth()+1) + '/' + match_datetime.getUTCFullYear() + '  ' + match_datetime.getUTCHours() + ':' + match_datetime.getUTCMinutes() + ':' + match_datetime.getUTCSeconds());
		// console.log('Current Date : ' + current_datetime.toISOString());
		// console.log('Type : ' + typeof(match_datetime));
		// new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]])
		const matchDate = new Date(str);
		const match_date = new Date(matchDate.getUTCFullYear(), matchDate.getUTCMonth(), matchDate.getUTCDate(), matchDate.getUTCHours(), matchDate.getUTCMinutes(), matchDate.getUTCSeconds());
		// console.log('MatchDatetime : ' + match_date.toString());
		// console.log('CurrentDatetime : ' + current_datetime.toString());
		// console.log(match_date - current_datetime);
		// console.log(match_date < current_datetime);
		if (selectedTeamId == 0) {
			showSweetAlert('warning', 'Team not selected', "Please select Team for Bet.");
		}
		else if (points < 1) {
			showSweetAlert('warning', 'Invalid Bet Points', "Please enter valid value for Bet points.");
		}
		else if (points != parseInt(points)) {
			showSweetAlert('warning', 'Invalid Bet Points', "Bet points must be an integer value.");
		}
		else if (points < matchData.minimumPoints) {
			showSweetAlert('warning', 'Invalid Bet Points', "Please enter Bet points greater than minimum limit of " + matchData.minimumPoints);
		}
		else if (match_date < current_datetime) {
			showSweetAlert('warning', 'Match time out', "Sorry, the match has already started, so the Bets for this match are closed now.");
		}
		else {
			// LOGS
			// console.log('userId : ' + userId);
			// console.log('matchId : ' + matchId);
			// console.log('selectedTeamId : ' + selectedTeamId);
			// console.log('points : ' + points);

			setWaiting(true);
			// console.log(parseInt(points));
			if (option == 'insert') {
				// console.log('insert');
				// console.log('Type before insert : ' + typeof(points));
				if (parseInt(points) > parseInt(availablePoints)) {
					setWaiting(false);
					showSweetAlert('warning', 'Insufficient Points', "Your have only " + parseInt(availablePoints) + " available points.");
				}
				else {
					const requestData = {
						userId: userId,
						matchId: matchId,
						teamId: selectedTeamId,
						contestPoints: parseInt(points),
						winningPoints: 0
					};
					// console.log(requestData);
					axios.post(baseurl + '/contest', requestData, { headers })
						.then((response) => {
							setWaiting(false);
							if (response.status == 201) {
								setAvailablePoints((availablePoints) => parseInt(availablePoints) - parseInt(points));
								setOldPoints(parseInt(points));
								setContestId(response.data.contestId);
								// console.log('Insert success : ContestId = ' + json.data.contestId);
								// console.log('Insert : ' + typeof(points));
								fetchData(matchData);
								// fetchMatchData(token);
								fetchUserData();
								setOption('update');
								showSweetAlert('success', 'Bet placed successfully !', "Your Bet for " + parseInt(points) + " points is placed successfully.");
							}
							else {
								// console.log(response.status);
								showSweetAlert('warning', 'Network Error', 'Something went wrong. Please check your internet connection or try again after sometime...');
							}
						})
						.catch((error) => {
							setWaiting(false);
							// console.log(error);
							// console.log(error.response);
							// console.log(error.response.data);
							// console.log(error.response.status);
							if (error.response && error.response.status === 403) {
								// showSweetAlert('error', 'Timeout', 'Match has started');
								showSweetAlert('error', 'Timeout', error.response.data.message);
								navigation.goBack();
							} else if (error.response && error.response.status === 401) {
								showSweetAlert('error', 'Network Error', errorMessage);
								logout();
							} else {
								showSweetAlert('error', 'Network Error', errorMessage);
							}
						});
				}
			}
			else if (option == 'update') {
				// console.log('update');
				const balance = parseInt(availablePoints) + parseInt(oldPoints);
				if (parseInt(points) > balance) {
					setWaiting(false);
					showSweetAlert('warning', 'Insufficient Points', "Your have only " + (balance) + " available points.");
				}
				else {
					const requestData = {
						userId: userId,
						matchId: matchId,
						teamId: selectedTeamId,
						contestPoints: parseInt(points),
						winningPoints: 0
					};
					// console.log(requestData);
					axios.put(baseurl + '/contest/' + contestId, requestData, { headers })
						.then((response) => {
							setWaiting(false);
							if (response.status == 200) {
								setAvailablePoints((availablePoints) => parseInt(availablePoints) + parseInt(oldPoints) - parseInt(points));
								// console.log('After update : ' + typeof(oldPoints));
								setOldPoints(points);
								setContestId(response.data.contestId);
								// console.log('Update success : ContestId = ' + json.data.contestId);
								fetchData(matchData);
								fetchUserData();
								// showSweetAlert('success', 'Contest updated successfully', "Your contest is updated from " + oldPoints + " points to " + points + " points.");
								showSweetAlert('success', 'Bet updated successfully !', "Your Bet is updated to " + parseInt(points) + " points.");
							}
							else {
								// console.log(request.status);
								showSweetAlert('warning', 'Network Error', 'Something went wrong. Please check your internet connection or try again after sometime...');
							}
						})
						.catch((error) => {
							// console.log(error);
							setWaiting(false);
							if (error.response && error.response.status === 403) {
								// showSweetAlert('error', 'Timeout', 'Match has started');
								showSweetAlert('error', 'Timeout', error.response.data.message);
								navigation.goBack();
							} else if (error.response && error.response.status === 401) {
								showSweetAlert('error', 'Network Error', errorMessage);
								logout();
							} else {
								showSweetAlert('error', 'Network Error', errorMessage);
							}
						});
				}
			}
		}
	}

	const sort = (column) => {
		let order = sortOrder;
		if (sortColumn === column) {
			order = order * -1;
			setSortOrder(order);
		} else {
			order = 1;
			setSortOrder(1);
		}
		setSortColumn(column);
		switch (column) {
			case 'name':
				setData((oldData) => {
					const newData = [...oldData];
					newData.sort((a, b) => {
						const val1 = a.firstName.toLowerCase() + ' ' + a.lastName.toLowerCase();
						const val2 = b.firstName.toLowerCase() + ' ' + b.lastName.toLowerCase();
						if (val1 < val2) {
							return order * -1;
						}
						if (val1 > val2) {
							return order * 1;
						}
						return 0;
					});
					return newData;
				});
				break;
			case 'team':
				setData((oldData) => {
					const newData = [...oldData];
					newData.sort((a, b) => {
						const val1 = a.teamShortName.toLowerCase();
						const val2 = b.teamShortName.toLowerCase();
						if (val1 < val2) {
							return order * -1;
						}
						if (val1 > val2) {
							return order * 1;
						}
						return 0;
					});
					return newData;
				});
				break;
			case 'points':
				setData((oldData) => {
					const newData = [...oldData];
					newData.sort((a, b) => (a.contestPoints - b.contestPoints) * order);
					return newData;
				});
				break;
		}
	};

	const { colors } = useTheme();

	// console.log(data);
	const card1Style = selectedTeamId == matchData.team1Id ? styles.bgColorSelected : styles.bgColorNormal;
	const card2Style = selectedTeamId == matchData.team2Id ? styles.bgColorSelected : styles.bgColorNormal;

	return (
		<ScrollView style={styles.container} keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
			<Spinner visible={waiting} textContent="Loading..." animation="fade" textStyle={styles.spinnerTextStyle} />
			<StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
			{loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
			<View>
				<TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#FFF" size={40} style={{ marginLeft: 20, marginTop: 10 }} /></TouchableOpacity>
				<View style={styles.header}>
					<Text style={styles.text_header}>Place Bet</Text>
				</View>
				<Animatable.View
					animation="fadeInUpBig"
					style={[styles.footer, {
						backgroundColor: colors.background
					}]}
				>
					<View>
						<Text style={styles.dateStyle}>{formatDate(matchData.startDatetime)}</Text>
					</View>
					<View style={styles.boxContainer}>
						<TouchableOpacity style={[styles.box, card1Style]} onPress={() => setSelectedTeamId(matchData.team1Id)}>
							<View style={styles.ellipseRow}>
								<Card.Image style={styles.ellipse} source={{ uri: matchData.team1Logo }} />
								<Text style={styles.ellipseText}>{matchData.team1Short}</Text>
							</View>
							<View style={styles.dividerStyle} ></View>
							<View>
								<Text style={styles.txtContestPoints}>{team1BetPoints} ({team1NoOfBets} {team1NoOfBets > 1 ? 'bets' : 'bet'})</Text>
							</View>
							{/* <View>
								<Text style={styles.txtUsers}>({team1NoOfBets} bets)</Text>
							</View> */}
						</TouchableOpacity>
						<TouchableOpacity style={[styles.box, card2Style]} onPress={() => { setSelectedTeamId(matchData.team2Id) }}>
							<View style={styles.ellipseRow}>
								<Card.Image style={styles.ellipse} source={{ uri: matchData.team2Logo }} />
								<Text style={styles.ellipseText}>{matchData.team2Short}</Text>
							</View>
							<View style={styles.dividerStyle} ></View>
							<View>
								<Text style={styles.txtContestPoints}>{team2BetPoints} ({team2NoOfBets} {team2NoOfBets > 1 ? 'bets' : 'bet'})</Text>
							</View>
							{/* <View>
								<Text style={styles.txtUsers}>({team2NoOfBets} bets)</Text>
							</View> */}
						</TouchableOpacity>
					</View>
					<View style={styles.pointsContainer}>
						<View style={{ display: 'flex', flexDirection: 'row' }}>
							<Text style={styles.boldText}>Available Points:</Text>
							<Text> {availablePoints}</Text>
						</View>
						<View style={{ display: 'flex', flexDirection: 'row' }}>
							<Text style={styles.boldText}>Minimum Points:</Text>
							<Text> {matchData.minimumPoints}</Text>
						</View>
					</View>
					<View style={styles.lblContestPointsContainer}>
						<Text style={styles.lblContestPoints}>
							Bet Points (Remaining Points: {tempAvailablePoints > 0 ? tempAvailablePoints : 0})
            </Text>
					</View>
					<View style={styles.inputContainer}>
						<FontAwesome
							name="money"
							color="#000"
							size={20}
							style={{ paddingLeft: 5 }}
						/>
						<TextInput
							placeholder="Type your Bet Points here..."
							placeholderTextColor="#666666"
							keyboardType="numeric"
							style={styles.textInput}
							clearButtonMode="while-editing"
							onChangeText={(val) => {
								setPoints(val)
								// console.log(val);
								let contestPoints = 0;
								if (val == '')
									contestPoints = 0;
								else {
									contestPoints = parseInt(val);
									if (isNaN(contestPoints) || contestPoints < 0) {
										contestPoints = 0;
									}
								}
								setTempAvailablePoints(parseInt(availablePoints) + parseInt(oldPoints) - contestPoints);
							}}
							value={points != 0 ? points.toString() : ''}
						/>
					</View>
					<View style={styles.btnContainer}>
						<TouchableOpacity
							onPress={() => { contestHandler() }}
							style={styles.btn}
						>
							<Text style={styles.btnText}>
								{option == 'insert' ? 'Place Bet' : 'Update Bet'}
							</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.boxContainer}>
						<Text style={styles.heading}>Bets for this Match {data.length > 0 && <>({data.length} {data.length > 1 ? 'bets' : 'bet'})</>}</Text>
					</View>
					<View style={styles.listContainer}>
						<View style={styles.headingRow}>
							<TouchableOpacity
								onPress={() => { sort('name') }}
								style={[styles.headingCol, styles.headingCol1]}>
								<Text style={styles.headingColText}>Name</Text>
								<FontAwesome name="sort" color="#000" size={15} />
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => { sort('team') }}
								style={[styles.headingCol, styles.headingCol2]}>
								<Text style={styles.headingColText}>Team</Text>
								<FontAwesome name="sort" color="#000" size={15} />
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => { sort('points') }}
								style={[styles.headingCol, styles.headingCol3]}>
								<Text style={styles.headingColText}>Points</Text>
								<FontAwesome name="sort" color="#000" size={15} />
							</TouchableOpacity>
						</View>
						{data.length == 0 && (<Text style={styles.msgStyle}>No users have placed bet on this match.</Text>)}
						{
							data && data.length > 0 && data.map((item, index) => {
								const mystyle = item.username == username ? styles.bgDark : styles.bgLight;
								return (
									<View style={[styles.listItem, mystyle]} key={item.contestId}>
										{
											item.profilePicture != '' ?
												(<Avatar
													size="small"
													rounded
													source={{
														uri: item.profilePicture
													}}
													containerStyle={{ marginLeft: 5 }}
												/>) :
												(<Avatar
													size="small"
													rounded
													title={item.firstName.substr(0, 1) + item.lastName.substr(0, 1)}
													// activeOpacity={0.7}
													containerStyle={{ marginLeft: 5, backgroundColor: getColor(item.firstName) }}
												/>)
										}
										<Text style={[styles.cardItem, styles.name]}>{item.firstName + ' ' + item.lastName}</Text>
										<Text style={[styles.cardItem, styles.teamShortName]}>{item.teamShortName}</Text>
										<Text style={[styles.cardItem, styles.points]}>{item.contestPoints}</Text>
									</View>
								);
							})
						}
					</View>
				</Animatable.View>
			</View>
		</ScrollView>
	);
};

export default ContestScreen;

const styles = StyleSheet.create({
	container: {
		width: '100%',
		display: 'flex',
		flex: 1,
		backgroundColor: '#19398A',
	},
	header: {
		flex: 1,
		justifyContent: 'flex-end',
		paddingHorizontal: 20,
		paddingBottom: 20,
		marginTop: 10,
	},
	footer: {
		flex: 3,
		backgroundColor: '#fff',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingHorizontal: 10,
		paddingVertical: 15,
	},
	text_header: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 25
	},
	boldText: {
		fontWeight: 'bold',
	},
	dateStyle: {
		color: '#000',
		fontWeight: 'bold',
		fontSize: 18,
		textAlign: 'center',
		textDecorationLine: 'underline',
		marginBottom: 5,
	},
	boxContainer: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 5,
		marginBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#f2f2f2',
		alignItems: 'center',
		justifyContent: 'space-around',
		// backgroundColor: 'pink'
	},
	box: {
		width: '47%',
		// backgroundColor: "#E6E6E6",
		borderWidth: 2,
		// borderColor: "#000",
		borderColor: '#19398A',
		borderRadius: 10,
		//   marginTop: 10,
		display: "flex",
		flexDirection: 'column',
		// alignItems: 'center',
		// justifyContent: 'space-between',
	},
	ellipseRow: {
		// height: 95,
		display: "flex",
		flexDirection: "row",
		marginTop: 8,
		marginBottom: 8,
		//   marginLeft: 25,
		// alignSelf: "flex-start"
		// flex: 4,
		justifyContent: "space-evenly",
	},
	ellipse: {
		width: 60,
		height: 60,
		borderRadius: 50,
	},
	ellipseText: {
		fontFamily: "roboto-regular",
		color: "#121212",
		fontSize: 18,
		lineHeight: 60,
		fontWeight: "bold",
	},
	txtContestPoints: {
		color: '#000',
		fontWeight: 'bold',
		fontSize: 18,
		textAlign: 'center',
		marginTop: 5,
		marginBottom: 8
		// backgroundColor: 'yellow'
	},
	// txtUsers: {
	// 	color: '#000',
	// 	fontWeight: 'bold',
	// 	fontSize: 16,
	// 	textAlign: 'center',
	// 	paddingTop: 5,
	// 	paddingBottom: 8,
	// },
	pointsContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 5,
		paddingRight: 5,
	},
	lblContestPointsContainer: {
		marginTop: 10,
		paddingLeft: 5,
		paddingRight: 5,
	},
	lblContestPoints: {
		color: '#000',
		fontWeight: 'bold',
		fontSize: 16,
	},
	inputContainer: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: 5,
		marginBottom: 5,
		borderBottomWidth: 1,
		borderBottomColor: '#f2f2f2',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	textInput: {
		flex: 1,
		// marginTop: Platform.OS === 'ios' ? 0 : -12,
		paddingLeft: 10,
		// color: '#05375a',
		// color: colors.text,
		color: '#000'
	},
	btnContainer: {
		alignItems: 'center',
		marginTop: 10
	},
	btn: {
		width: '100%',
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
		borderColor: '#19398A',
		borderWidth: 1,
	},
	btnText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#19398A'
	},
	// radioCircle: {
	//     height: 30,
	//     width: 30,
	//     borderRadius: 100,
	//     borderWidth: 2,
	//     borderColor: '#3740ff',
	//     alignItems: 'center',
	//     justifyContent: 'center',
	//     // marginLeft:20 ,
	//     marginTop: 40,
	//     marginLeft: 5
	// },
	// selectedRb: {
	//     width: 20,
	//     height: 20,
	//     borderRadius: 50,
	//     backgroundColor: '#19398A',
	// },
	heading: {
		color: '#000',
		fontWeight: 'bold',
		fontSize: 20,
		textAlign: 'center',
		marginTop: 15
	},
	listContainer: {
		display: 'flex',
		flexDirection: 'column',
		// alignItems: 'center',
		// backgroundColor: 'yellow'
		// backgroundColor: '#E6E6E6'
	},
	headingRow: {
		// width: '100%',
		height: 40,
		// backgroundColor: "rgba(25,57,138,1)",
		// backgroundColor: '#1F4F99',
		backgroundColor: '#3D74C7',
		borderWidth: 0,
		borderColor: "#000000",
		borderRadius: 2,
		// borderRadius: 5,
		display: 'flex',
		flexDirection: 'row',
		fontFamily: "roboto-regular",
		// color: "rgba(255,255,255,1)",
		color: '#000',
		fontSize: 20,
		alignItems: 'center',
		fontWeight: 'bold'
	},
	headingCol: {
		display: 'flex',
		flexDirection: 'row',
		color: '#000',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	headingCol1: {
		width: '60%',
	},
	headingCol2: {
		width: '20%',
	},
	headingCol3: {
		width: '20%',
		// textAlign: 'right',
		justifyContent: 'flex-end',
		paddingRight: 10,
		// backgroundColor: 'yellow'
	},
	headingColText: {
		paddingRight: 8,
		fontSize: 14,
		fontWeight: 'bold',
	},
	msgStyle: {
		marginTop: 20,
		fontSize: 16,
		fontWeight: 'bold'
	},
	listItem: {
		width: '100%',
		height: 45,
		borderWidth: 1,
		borderColor: "#000000",
		borderRadius: 5,
		marginTop: 7,
		display: "flex",
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	cardItem: {
		color: "#121212",
		fontSize: 16,
		fontWeight: "bold",
		display: 'flex',
		justifyContent: 'space-between',
	},
	name: {
		width: '53%',
		paddingLeft: 10,
	},
	teamShortName: {
		width: '20%',
		fontSize: 17,
		paddingLeft: 5,
	},
	points: {
		textAlign: 'center',
		paddingRight: 8,
		width: '15%',
	},
	bgLight: {
		backgroundColor: "#E6E6E6",
	},
	bgDark: {
		backgroundColor: '#87CEFA'
	},
	spinnerTextStyle: {
		color: '#FFF'
	},
	bgColorNormal: {
		backgroundColor: "#E6E6E6"
	},
	bgColorSelected: {
		// backgroundColor: "#BDE0FE"
		backgroundColor: "#87CEFA"
		// backgroundColor: "#BDE0FE"
		// backgroundColor: "#BDE0FE"
		// backgroundColor: "#BDE0FE"
		// backgroundColor: "#BDE0FE"
	},
	dividerStyle: {
		height: 2,
		backgroundColor: '#19398A'
	},
});