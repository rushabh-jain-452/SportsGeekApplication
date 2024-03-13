import React, { useState, useEffect } from 'react';
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
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../App';

import showSweetAlert from '../helpers/showSweetAlert';
import { baseurl, errorMessage } from '../config';

const ForgetPasswordScreen = () => {
    const { loginState } = React.useContext(AuthContext);
    const token = loginState.token;

    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [mobileNumber, setMobileNumber] = useState('');
    const [success, setSuccess] = useState(false);
    const [userId, setUserId] = useState(false);

    // For Update password
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);

    const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@%!])[0-9a-zA-Z@%!]{8,}$/;

    const [loading, setLoading] = React.useState(false);

    const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const ForgetPasswordHandler = () => {
        if (!validEmail) {
            // showSweetAlert('warning', 'Invalid Input!', 'Please enter valid email of BBD domain to proceed.');
            showSweetAlert('warning', 'Invalid Input!', 'Please enter valid email of Gmail to proceed.');
            // showSweetAlert('warning', 'Invalid Input!', 'Please enter valid email to proceed.');
        }
        else if (mobileNumber.length < 9) {
            showSweetAlert('warning', 'Invalid Input!', 'Please enter valid mobile number to proceed.');
        }
        else {
            setLoading(true);
            const requestData = {
                email: email,
                mobileNumber: mobileNumber
            };
            axios.post(baseurl + '/users/forget-password', requestData)
                .then((response) => {
                    setLoading(false);
                    console.log(response.data);
                    if (response.status == 200) {
                        setUserId(response.data.userId);
                        setEmail('');
                        setMobileNumber('');
                        showSweetAlert('success', 'Success', 'OTP sent successfully. Please check your email...!');
                    } else {
                        showSweetAlert('error', 'Network Error', errorMessage);
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        console.log(error.response.status);
                        console.log(error.response.data);
                        setLoading(false);
                        if (error.response.status == 404) {
                            showSweetAlert('warning', 'Invalid details', 'Email or mobile number is incorrect. Please enter correct email and mobile number to proceed.');
                        } else {
                            showSweetAlert('error', 'Network Error', errorMessage);
                        }
                    } else {
                        showSweetAlert('error', 'Network Error', errorMessage);
                    }
                });
        }
    }

    const updatePasswordHandler = () => {
        if (otp.length != 6) {
            showSweetAlert('warning', 'Invalid Input!', 'Please enter valid OTP of 6 digits to proceed.');
        }
        else if (!validPassword) {
            showSweetAlert('warning', 'Invalid Input!', 'Please enter valid password to proceed.');
        }
        else if (confirmPassword.length == 0) {
            showSweetAlert('warning', 'Invalid Input!', 'Please enter confirm password to proceed.');
        }
        else if (password != confirmPassword) {
            showSweetAlert('warning', 'Invalid Input!', 'Password and confirm password didn\'t match.');
        }
        else {
            setLoading(true);
            const requestData = {
                userId: userId,
                otp: otp,
                password: password
            };
            axios.put(baseurl + '/users/forget-password', requestData)
                .then((response) => {
                    setLoading(false);
                    console.log(response.data);
                    if (response.status == 200) {
                        setOtp('');
                        setPassword('');
                        setConfirmPassword('');
                        showSweetAlert('success', 'Success', 'Password changed successfully. Now, you can login with new password.');
                        navigation.goBack();
                    } else {
                        showSweetAlert('error', 'Network Error', errorMessage);
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        console.log(error.response.status);
                        console.log(error.response.data);
                        setLoading(false);
                        if (error.response.status == 404) {
                            showSweetAlert('warning', 'Invalid OTP.', 'Please enter correct OTP to proceed');
                        } else {
                            showSweetAlert('error', 'Network Error', errorMessage);
                        }
                    } else {
                        showSweetAlert('error', 'Network Error', errorMessage);
                    }
                });
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#FFF" size={40} style={{ marginLeft: 15, marginTop: 10 }} /></TouchableOpacity>
            <StatusBar backgroundColor="#1F4F99" backgroundColor='#19398A' barStyle="light-content" />
            <Spinner visible={loading} textContent="Loading..." animation="fade" textStyle={styles.spinnerTextStyle} />
            <View style={styles.header}>
                <Text style={styles.text_header}>Forget Password!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <ScrollView keyboardShouldPersistTaps="handled">
                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Email</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="envelope-o"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Your Email Address"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => {
                                setEmail(val);
                                // if (val.match(email_regex) && val.includes("bbd.co.za"))
                                if (val.match(email_regex) && val.includes("gmail.com"))
                                // if (val.match(email_regex))
                                    setValidEmail(true);
                                else
                                    setValidEmail(false);
                            }}
                            keyboardType="email-address"
                            maxLength={50}
                            value={email}
                        />
                        {validEmail ?
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
                    {(email.length > 0 && !validEmail) ?
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            {/* <Text style={styles.errorMsg}>Please enter valid email of BBD domain only.</Text> */}
                            <Text style={styles.errorMsg}>Please enter valid email of Gmail only.</Text>
                            {/* <Text style={styles.errorMsg}>Please enter valid email.</Text> */}
                        </Animatable.View>
                        : null
                    }
                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Mobile Number</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="mobile"
                            color="#05375a"
                            size={20}
                        />

                        <TextInput
                            placeholder="Your Mobile Number"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => setMobileNumber(val)}
                            keyboardType="number-pad"
                            maxLength={15}
                            value={mobileNumber}
                        />
                        {mobileNumber.length > 0 && mobileNumber.length == 10 ?
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
                    {(mobileNumber.length > 0 && mobileNumber.length < 9) ?
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Please enter valid mobile number.</Text>
                        </Animatable.View>
                        : null
                    }
                    <View style={styles.button}>
                        <TouchableOpacity
                            onPress={() => { ForgetPasswordHandler() }}
                            style={[styles.signIn, {
                                borderColor: '#19398A',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#19398A'
                            }]}>Get OTP</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 50, marginBottom: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#00f' }}>Update Password after getting OTP</Text>
                    </View>

                    <Text style={styles.text_footer}>OTP</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-o"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Enter OTP here"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => { setOtp(val) }}
                            keyboardType="number-pad"
                            maxLength={6}
                            value={otp}
                        />
                        {otp.length == 6 ?
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
                    {(otp.length > 0 && otp.length < 6) ?
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Please enter valid OTP of 6 digits</Text>
                        </Animatable.View>
                        : null
                    }
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>New Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Your Password"
                            secureTextEntry={secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => {
                                setPassword(val);
                                if (val.match(password_regex))
                                    setValidPassword(true);
                                else
                                    setValidPassword(false);
                            }}
                            maxLength={50}
                            value={password}
                        />
                        <TouchableOpacity
                            onPress={() => setSecureTextEntry(!secureTextEntry)}
                        >
                            {secureTextEntry ?
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
                    {(password.length > 0 && !validPassword) ?
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Must contain at least 1 number, 1 special character and 1 uppercase 1 lowercase letter, and at least 8 or more characters.</Text>
                        </Animatable.View>
                        : null
                    }

                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Confirm New Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Confirm Your Password"
                            secureTextEntry={confirmSecureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => setConfirmPassword(val)}
                            maxLength={50}
                            value={confirmPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)}
                        >
                            {confirmSecureTextEntry ?
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
                    {(confirmPassword.length > 0 && password != confirmPassword) ?
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Password and confirm password must match.</Text>
                        </Animatable.View>
                        : null
                    }

                    <View style={styles.button}>
                        <TouchableOpacity
                            onPress={() => { updatePasswordHandler() }}
                            style={[styles.signIn, {
                                borderColor: '#19398A',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#19398A'
                            }]}>Update Password</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={{ marginTop: 100 }}></View>
                </ScrollView>
            </Animatable.View>
        </View>
    );
};

export default ForgetPasswordScreen;

const styles = StyleSheet.create({
    container: {
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
        fontSize: 18
    },
    action: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
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
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    spinnerTextStyle: {
        color: '#FFF'
    }
});