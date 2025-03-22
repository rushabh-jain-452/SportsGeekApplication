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
	Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';

import showSweetAlert from '../../helpers/showSweetAlert';
import { errorMessage } from '../../config';
import { AuthContext } from '../../../App';

const PlayerTypeScreen = ({ navigation }) => {
	const { loginState, logout } = useContext(AuthContext);
	let baseurl = loginState.backendUrl;

	const headers = { 'Authorization': 'Bearer ' + loginState.token };

	const [data, setData] = useState([]);
	const [playerType, setPlayerType] = useState('');
	const [btnText, setBtnText] = useState('Add');
	const [playerTypeId, setPlayerTypeId] = useState(0);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		displayPlayerType();
		setPlayerType('');
	}, []);

	useEffect(() => {
		displayPlayerType();
		setPlayerType('');
	}, [refreshing]);

	const displayPlayerType = () => {
		setLoading(true);
		axios.get(baseurl + '/player-types', { headers })
			.then(response => {
				setLoading(false);
				setRefreshing(false);
				if (response.status == 200) {
					setData(response.data);
				}
				else {
					console.log('1');
					showSweetAlert('error', 'Network Error', errorMessage);
				}
			})
			.catch(error => {
				setLoading(false);
				setRefreshing(false);
				// console.log(error);
				// console.log(error.response);
				showSweetAlert('error', 'Network Error', errorMessage);
				if (error.response && error.response.status === 401) {
					logout();
				}
			})
	}

	const addPlayerType = () => {
		if (playerType != '') {
			const requestData = {
				typeName: playerType
			};
			setLoading(true);
			axios.post(baseurl + '/player-types', requestData, { headers })
				.then((response) => {
					setLoading(false);
					if (response.status == 201) {
						showSweetAlert('success', 'Success', 'PlayerType added successfully.');
						displayPlayerType();
					}
					else {
						showSweetAlert('error', 'Error', 'Failed to add PlayerType. Please try again...');
					}
					setPlayerType('');
				})
				.catch((error) => {
					setLoading(false);
					showSweetAlert('error', 'Error', 'Failed to add PlayerType. Please try again...');
					if (error.response && error.response.status === 401) {
						logout();
					}
				})
		} else {
			showSweetAlert('warning', 'Invalid Input', 'Please enter valid value for PlayerType.');
		}
	}

	const deletePlayerType = (id) => {
		setLoading(true);
		axios.delete(baseurl + '/player-types/' + id, { headers })
			.then((response) => {
				setLoading(false);
				if (response.status == 200) {
					showSweetAlert('success', 'Success', 'PlayerType deleted successfully.');
					displayPlayerType();
				}
				else {
					showSweetAlert('error', 'Error', 'Failed to delete PlayerType. Please try again...');
				}
				setPlayerType('');
			})
			.catch((error) => {
				setLoading(false);
				showSweetAlert('error', 'Error', 'Failed to delete PlayerType. Please try again...');
				if (error.response && error.response.status === 401) {
					logout();
				}
			})
	}

	const editPlayerType = (playerTypeId, typeName) => {
		setPlayerType(typeName);
		setBtnText('Update');
		setPlayerTypeId(playerTypeId);
	}

	const updatePlayerType = () => {
		if (playerType != '') {
			const requestData = {
				typeName: playerType
			};
			setLoading(true);
			axios.put(baseurl + '/player-types/' + playerTypeId, requestData, { headers })
				.then((response) => {
					setLoading(false);
					if (response.status == 200) {
						showSweetAlert('success', 'Success', 'PlayerType updated successfully..');
						displayPlayerType();
					}
					else {
						showSweetAlert('error', 'Error', 'Failed to update PlayerType. Please try again...');
					}
					setPlayerType('');
					setBtnText('Add');
				})
				.catch((error) => {
					setLoading(false);
					showSweetAlert('error', 'Error', 'Failed to update PlayerType. Please try again...');
					if (error.response && error.response.status === 401) {
						logout();
					}
				})
		} else {
			showSweetAlert('warning', 'Invalid Input', 'Please enter valid value for PlayerType.');
		}
	}

	const getConfirmation = (playerTypeId) =>
		Alert.alert(
			"Delete Confirmation",
			"Do you really want to delete the Player Type ?",
			[
				{
					text: "Cancel"
				},
				{
					text: "OK",
					onPress: () => { deletePlayerType(playerTypeId) }
				}
			]
		);

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#FFF" size={40} style={{ marginLeft: 20, marginTop: 10, width: 100 }} /></TouchableOpacity>
			<Spinner visible={loading} textContent="Loading..." animation="fade" textStyle={styles.spinnerTextStyle} />
			<StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
			<View style={styles.header}>
				<Text style={styles.text_header}>PlayerType Details</Text>
			</View>
			<Animatable.View
				animation="fadeInUpBig"
				style={styles.footer}
			>
				<ScrollView keyboardShouldPersistTaps="handled" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
					<Text style={[styles.text_footer, { marginTop: 35 }]}>PlayerType Name</Text>
					<View style={styles.action}>
						<FontAwesome
							name="mars"
							color="#05375a"
							size={20}
						/>
						<TextInput
							placeholder="Enter PlayerType Name"
							style={styles.textInput}
							autoCapitalize="none"
							onChangeText={(val) => setPlayerType(val)}
							value={playerType}
							maxLength={20}
						/>
						{(playerType != '') ?
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
							onPress={(btnText == 'Add') ? addPlayerType : updatePlayerType}
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
							<View style={styles.card} key={item.playerTypeId} >
								<View style={styles.cardlist}>
									<View style={styles.ellipse1}>
										<Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>{(item.typeName).substr(0, 2)}</Text>
									</View>
									<Text style={[styles.carditem, { width: '65%', paddingLeft: 20 }]}>{item.typeName}</Text>
									<TouchableOpacity onPress={() => { editPlayerType(item.playerTypeId, item.typeName) }} style={{ width: '10%' }}><Text style={[styles.carditem]}><Icon name="circle-edit-outline" color="#19398A" size={30} /></Text></TouchableOpacity>
									<TouchableOpacity onPress={() => { getConfirmation(item.playerTypeId) }} style={{ width: '10%' }}><Text style={[styles.carditem]}><Icon name="delete-circle-outline" color="#19398A" size={30} /></Text></TouchableOpacity>
								</View>
							</View>
						))
					}

				</ScrollView>
			</Animatable.View>
		</View>
	);
};

export default PlayerTypeScreen;

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
	spinnerTextStyle: {
		color: '#FFF'
	}
});