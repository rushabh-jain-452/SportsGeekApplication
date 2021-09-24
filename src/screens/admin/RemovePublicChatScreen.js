import React, { useState, useEffect, useContext } from 'react';
import {
	View,
	Text,
	Button,
	TouchableOpacity,
	TouchableHighlight,
	Dimensions,
	TextInput,
	Platform,
	StyleSheet,
	ScrollView,
	StatusBar,
	LogBox,
	ActivityIndicator,
	Alert,
	Animated,
	Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

import showSweetAlert from '../../helpers/showSweetAlert';
import { formatDate } from '../../helpers/dateFunctions';
import { baseurl, errorMessage } from '../../config';
import { AuthContext } from '../../../App';

// https://github.com/jemise111/react-native-swipe-list-view/blob/master/SwipeListExample/examples/swipe_value_based_ui.js

const RemovePublicChatScreen = ({ navigation }) => {
	const { loginState, logout } = useContext(AuthContext);

	const headers = { 'Authorization': 'Bearer ' + loginState.token };

	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [waiting, setWaiting] = React.useState(false);

	useEffect(() => {
		fetchChatData();
	}, []);

	const fetchChatData = () => {
		const days = 30;
		// setWaiting(true);
		axios.get(baseurl + '/public-chat/last-days/' + days, { headers })
			.then(response => {
				// setWaiting(false);
				setLoading(false);
				if (response.status == 200) {
					// response.data.forEach((item) => item.key = item.publicChatId);
					// console.log(response.data);
					setData(response.data);
				}
				else {
					showSweetAlert('error', 'Network Error', errorMessage);
				}
			})
			.catch((error) => {
				// setWaiting(false);
				setLoading(false);
				showSweetAlert('error', 'Network Error', errorMessage);
				if (error.response && error.response.status === 401) {
					logout();
				}
			});
	}

	const removeChat = (publicChatId) => {
		setWaiting(true);
		axios.put(baseurl + '/public-chat/' + publicChatId + '/status/0', {}, { headers })
			.then((response) => {
				setWaiting(false);
				if (response.status === 200) {
					showSweetAlert('success', 'Success', 'Chat deleted successfully.');
					fetchChatData();
				}
				else {
					showSweetAlert('error', 'Error', 'Failed to delete Chat. Please try again...');
				}
			})
			.catch((error) => {
				setWaiting(false);
				showSweetAlert('error', 'Error', 'Failed to delete Chat. Please try again...');
				if (error.response && error.response.status === 401) {
					logout();
				}
			});
	}

	const getConfirmation = (publicChatId) =>
		Alert.alert(
			"Delete Confirmation",
			"Do you really want to delete this Chat ?",
			[
				{
					text: "Cancel"
				},
				{
					text: "OK",
					onPress: () => { removeChat(publicChatId) }
				}
			]
		);

	const closeRow = (rowMap, rowKey) => {
		// console.log('closeRow');
		// console.log(rowMap, rowKey);
		if (rowMap[rowKey]) {
			rowMap[rowKey].closeRow();
		}
	};

	const deleteRow = (rowMap, item) => {
		// console.log('deleteRow');
		// console.log(rowMap, rowKey);
		// console.log(item.publicChatId);
		// closeRow(rowMap, rowKey);
		// const newData = [...listData];
		// const prevIndex = listData.findIndex(item => item.key === rowKey);
		// newData.splice(prevIndex, 1);
		// setListData(newData);
		// Call API to update status
		getConfirmation(item.publicChatId);
	};

	// const onRowDidOpen = rowKey => {
	// 	console.log('This row opened', rowKey);
	// };

	// const onSwipeValueChange = swipeData => {
	// console.log('onSwipeValueChange');
	// console.log(swipeData);
	// const { key, value } = swipeData;
	// rowSwipeAnimatedValues[key].setValue(Math.abs(value));
	// };

	const renderHiddenItem = (data, rowMap) => (
		<View style={styles.rowBack}>
			{/* <Text>Left</Text> */}
			{/* <TouchableOpacity
				style={[styles.backRightBtn, styles.backRightBtnLeft]}
				onPress={() => closeRow(rowMap, data.item.key)}
			>
				<Text style={styles.backTextWhite}>Close</Text>
			</TouchableOpacity> */}
			<TouchableOpacity
				style={[styles.backRightBtn, styles.backRightBtnRight]}
				onPress={() => deleteRow(rowMap, data.item)}
			>
				<Animated.View
					style={[
						styles.trash,
						// {
						//     transform: [
						//         {
						//             scale: rowSwipeAnimatedValues[
						//                 data.item.key
						//             ].interpolate({
						//                 inputRange: [45, 90],
						//                 outputRange: [0, 1],
						//                 extrapolate: 'clamp',
						//             }),
						//         },
						//     ],
						// },
					]}
				>
					<Icon name="delete" color="#FFF" size={25} />
				</Animated.View>
			</TouchableOpacity>
		</View>
	);

	const renderItem = (data, rowMap) => {
		return (
			<View style={styles.rowContainer}>
				<Text style={styles.txtMsg}>{data.item.message}</Text>
				<Text style={styles.txtName}>~ {data.item.firstName + ' ' + data.item.lastName} ({formatDate(data.item.chatTimestamp)})</Text>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
			<TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#19398A" size={40} style={{ marginLeft: 20, marginTop: 10 }} /></TouchableOpacity>
			{/* <Text>Remove Public Chat</Text> */}
			<Spinner visible={waiting} textContent="Loading..." animation="fade" textStyle={styles.spinnerTextStyle} />
			{loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
			<Text style={styles.heading}>Swipe left the Chat Message to delete</Text>
			<SwipeListView
				data={data}
				renderItem={renderItem}
				renderHiddenItem={renderHiddenItem}
				// leftOpenValue={75}
				// rightOpenValue={-150}
				rightOpenValue={-75}
				keyExtractor={(item, index) => item.publicChatId}
				previewRowKey={'0'}
				previewOpenValue={-40}
				previewOpenDelay={3000}
				// onRowDidOpen={onRowDidOpen}
				// onSwipeValueChange={onSwipeValueChange}
				// disableLeftSwipe
				disableRightSwipe
				useNativeDriver={false}
			/>
		</View>
	);
};

export default RemovePublicChatScreen;

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1,
	},
	backTextWhite: {
		color: '#FFF',
	},
	rowContainer: {
		// alignItems: 'center',
		backgroundColor: '#CCC',
		borderBottomColor: 'black',
		borderBottomWidth: 1,
		// justifyContent: 'center',
		// height: 50,
	},
	heading: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: "center",
    paddingTop: 5,
		paddingBottom: 5,
  },
	txtMsg: {
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 3,
		paddingBottom: 2,
	},
	txtName: {
		paddingLeft: 10,
		paddingRight: 10,
		paddingBottom: 3,
	},
	rowBack: {
		alignItems: 'center',
		backgroundColor: '#DDD',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 15,
	},
	backRightBtn: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		width: 75,
	},
	backRightBtnLeft: {
		backgroundColor: 'blue',
		right: 75,
	},
	backRightBtnRight: {
		backgroundColor: 'red',
		right: 0,
	},
	trash: {
		height: 25,
		width: 25,
	},
	spinnerTextStyle: {
		color: '#FFF'
	},
});