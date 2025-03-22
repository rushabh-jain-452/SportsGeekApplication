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
	RefreshControl,
	Image,
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

import showSweetAlert from '../../helpers/showSweetAlert';
import { errorMessage } from '../../config';
import axios from 'axios';
// import { log } from 'react-native-reanimated';
import { AuthContext } from '../../../App';

const UpdateActiveTournamentScreen = ({ navigation }) => {
	const { loginState, logout } = useContext(AuthContext);
	let baseurl = loginState.backendUrl;

	const headers = { 'Authorization': 'Bearer ' + loginState.token };

	// LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
	const [data, setData] = useState([]);
	const [tournamentData, setTournamentData] = useState([]);
	const [tournamentId, setTournamentId] = useState(0);
	const [recData, setRecData] = useState([]);
	const [refreshing, setRefreshing] = React.useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// displayActiveTournament(token);
		displayTournament();
	}, [refreshing]);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		displayTournament();
	}, []);

	const displayTournament = () => {
		axios.get(baseurl + '/tournaments', { headers })
			.then(response => {
				setLoading(false);
				setRefreshing(false);
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
				setRefreshing(false);
				showSweetAlert('error', 'Network Error', errorMessage);
				if (error.response && error.response.status === 401) {
					logout();
				}
			})
	}

	const displayActiveTournament = () => {
		setLoading(true);
		axios.get(baseurl + '/tournaments/active-tournaments', { headers })
			.then(response => {
				setLoading(false);
				setRefreshing(false);
				if (response.status == 200) {
					setRecData(response.data);
					console.log("TOurnaments:" + response.data);
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

	const onChangeSS = (value) => {
		setTournamentId(value);
	};

	const tournamentHandler = () => {
		if (tournamentId == 0) {
			showSweetAlert('warning', 'Tournament not selected', 'Please select Tournament to proceed..');
		}
		else {
			setLoading(true);
			axios.put(baseurl + '/tournaments/activate-tournament/' + tournamentId, {}, { headers })
				.then((response) => {
					setLoading(false);
					if (response.status == 200) {
						showSweetAlert('success', 'Success', 'Tournament Activated successfully.');
					}
					else {
						showSweetAlert('error', 'Error', 'Failed to activate Tournament. Please try again...');
					}
					setTournamentId(0);
					// displayActiveTournament(token);   
				})
				.catch((error) => {
					setLoading(false);
					showSweetAlert('error', 'Error', 'Failed to activate Tournament. Please try again...');
					if (error.response && error.response.status === 401) {
						logout();
					}
				})
		}
	}

	const getConfirmation = () =>
		Alert.alert(
			"Recharge Confirmation",
			"Do you really want to Activate the Tournament?",
			[
				{
					text: "Cancel"
				},
				{
					text: "OK",
					onPress: tournamentHandler
				}
			]
		);

	return (
		<ScrollView keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
			<Spinner visible={loading} textContent="Loading..." animation="fade" textStyle={styles.spinnerTextStyle} />
			{/* <Image
        source={{
          uri: 'https://myheadphonewebsite.000webhostapp.com/images/loading/loading1.gif',
        }}
      /> */}
			<View style={styles.container}>
				<TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#FFF" size={40} style={{ marginLeft: 15, marginTop: 10 }} /></TouchableOpacity>
				<StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
				<View style={styles.header}>
					<Text style={styles.text_header}>Activate Tournament</Text>
				</View>
				<Animatable.View
					animation="fadeInUpBig"
					style={styles.footer}
				>

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
							}]}>Activate Tournament</Text>
						</TouchableOpacity>
					</View>

					{
						recData.map((item, index) => (
							<View style={styles.card} key={item.tournamentId} >
								<View style={styles.cardlist}>
									<View style={styles.ellipse1}>
										<Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>{(item.name).substr(0, 2)}</Text>
									</View>
									<Text style={[styles.carditem, { width: '40%', paddingLeft: 2 }]}>{item.name}</Text>
								</View>
							</View>
						))
					}

				</Animatable.View>
			</View>
		</ScrollView>
	);
};

export default UpdateActiveTournamentScreen;

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
		paddingBottom: 20,
		paddingTop: 30
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
		fontSize: 16,
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