import React from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
	StatusBar,
	Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';

const SplashScreen = ({ navigation }) => {
	const { colors } = useTheme();

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
			<View style={styles.header}>
				<Animatable.Image
					animation="bounceIn"
					duraton="1500"
					source={require('../assets/circle_logo.png')}
					style={styles.logo}
					resizeMode="stretch"
				/>
			</View>
			<Animatable.View
				style={[styles.footer, {
					backgroundColor: colors.background
				}]}
				animation="fadeInUpBig"
			>
				<Text style={styles.title}>Let the Game Begins!</Text>
				<Text style={styles.text}>Sign in with account</Text>
				<View style={styles.button}>
					<TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
						<Text style={styles.textSign}>Get Started</Text>
					</TouchableOpacity>
				</View>
			</Animatable.View>
		</View>
	);
};

export default SplashScreen;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#19398A'
	},
	header: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center'
	},
	footer: {
		flex: 1,
		backgroundColor: '#fff',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingVertical: 50,
		paddingHorizontal: 30
	},
	logo: {
		width: height_logo,
		height: height_logo
	},
	title: {
		color: '#05375a',
		fontSize: 30,
		fontWeight: 'bold'
	},
	text: {
		color: 'grey',
		marginTop: 5
	},
	button: {
		alignItems: 'flex-end',
		marginTop: 30
	},
	textSign: {
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 50,
		flexDirection: 'row',
		color: '#19398A',
		fontWeight: 'bold'
	}
});