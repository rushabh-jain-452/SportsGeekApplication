import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import ImagePicker from 'react-native-image-crop-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { Avatar } from "react-native-elements";
import axios from 'axios';

import showSweetAlert from '../helpers/showSweetAlert';
import getColor from '../helpers/getColor';
import { baseurl, errorMessage } from '../config';
import { AuthContext } from '../../App';

const UpdateProfilePictureScreen = ({ navigation }) => {
  const { loginState, logout } = useContext(AuthContext);
  const userId = loginState.userId;

  const headers = { 'Authorization': 'Bearer ' + loginState.token };

  const [data, setData] = useState([]);

  const [avatarPath, setAvatarPath] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [shortName, setShortName] = useState('');

  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    axios.get(baseurl + '/users/' + userId, { headers })
      .then((response) => {
        setLoading(false);
        if (response.status == 200) {
          setShortName(response.data.firstName.substr(0, 1) + response.data.lastName.substr(0, 1));
          setAvatarPath(response.data.profilePicture);
          setProfilePicture(response.data.profilePicture);
          setData(response.data);
          // console.log(response.data);
        } else {
          showSweetAlert('error', 'Network Error', errorMessage);
        }
      })
      .catch((error) => {
        setLoading(false);
        showSweetAlert('error', 'Network Error', errorMessage);
        if (error.response && error.response.status === 401) {
          logout();
        }
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

  const photoSelectHandler = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true
    }).then((image) => {
      if (validateImage(image)) {
        // console.log("Image path : " + image.path);
        // console.log(image);
        // setAvatarPath(image.path);
        // setProfilePicture(image);
        console.log(image);
        uploadProfilePictureHandler(image);
      }
    }).catch((error) => {
      showSweetAlert('warning', 'Image not selected', 'Image not selected for Profile Picture.');
    });
  }

  const getConfirmation = () =>
		Alert.alert(
			"Delete Confirmation",
			"Do you really want to remove your Profile Picture ?",
			[
				{
					text: "Cancel"
				},
				{
					text: "OK",
					onPress: photoRemoveHandler
				}
			]
		);

  const photoRemoveHandler = () => {
    // Call delete API endpoint
    setLoading(true);
    axios.delete(baseurl + '/users/' + userId + '/remove-profile-picture', { headers })
      .then((response) => {
        setLoading(false);
        if (response.status == 200) {
          showSweetAlert('success', 'Success', 'Profile Picture removed Successfully...!');
          setAvatarPath('');
          setProfilePicture('');
          // navigation.goBack();
        } else {
          showSweetAlert('warning', 'Failed', 'Profile Picture remove failed...!');
        }
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
        setLoading(false);
        showSweetAlert('error', 'Network Error', errorMessage);
        if (error.response && error.response.status === 401) {
          logout();
        }
      });
  };

  const uploadProfilePictureHandler = (image) => {
    setLoading(true);
    // Submitting Form Data (with Profile Picture)
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('mobileNumber', data.mobileNumber);
    formData.append('genderId', data.genderId);
    formData.append('updateProfilePicture', true);
    // Set Profile Picture
    const picturePath = image.path;
    const pathParts = picturePath.split('/');
    formData.append('profilePicture', {
      name: pathParts[pathParts.length - 1],
      type: image.mime,
      uri: image.path
    });
    const headers = {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + loginState.token
    }
    axios.put(baseurl + '/users/' + userId, formData, { headers })
      .then((response) => {
        setLoading(false);
        // console.log(response.status);
        // console.log(response.data);
        if (response.status == 200) {
          showSweetAlert('success', 'Success', 'Profile Picture Updated Successfully...!');
          setAvatarPath(image.path);
          setProfilePicture(image);
          // navigation.goBack();
        } else {
          showSweetAlert('warning', 'Updation Failed', 'Profile Picture Updation failed...!');
        }
      })
      .catch((error) => {
        // console.log(error);
        // console.log(error.response.status);
        // console.log(error.response.data);
        setLoading(false);
        showSweetAlert('error', 'Network Error', errorMessage);
        if (error.response && error.response.status === 401) {
          logout();
        }
      });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#FFF" size={40} style={{ marginLeft: 15, marginTop: 10 }} /></TouchableOpacity>
      <Spinner visible={loading} textContent="Loading..." animation="fade" textStyle={styles.spinnerTextStyle} />
      <StatusBar backgroundColor="#1F4F99" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Update Profile Picture</Text>
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={styles.footer}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.avatarContainer}>
            {
              avatarPath != '' ?
                (<Avatar
                  size="xlarge"
                  rounded
                  source={{
                    uri: avatarPath
                  }}
                  onPress={ photoSelectHandler }
                />) :
                (<Avatar
                  size="xlarge"
                  rounded
                  title={shortName}
                  activeOpacity={0.7}
                  containerStyle={{ color: 'red', backgroundColor: getColor(shortName), marginTop: 10 }}
                  onPress={ photoSelectHandler }
                />)
            }
          </View>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={ photoSelectHandler }>
            <Text style={styles.buttonTextStyle}>
              {profilePicture == '' ? "Select Profile Picture" : "Change Profile Picture"}
            </Text>
          </TouchableOpacity>
          {avatarPath != '' &&
            (<TouchableOpacity
              style={styles.removeButtonStyle}
              onPress={ getConfirmation }>
              <Text style={styles.buttonTextStyle}>Remove Profile Picture</Text>
            </TouchableOpacity>)}
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

export default UpdateProfilePictureScreen;

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
  buttonStyle: {
    backgroundColor: '#19398A',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    width: 200,
    alignSelf: 'center',
    // marginLeft: 80,
    // marginRight: 35,
    marginTop: 10,
    marginBottom: 15
  },
  removeButtonStyle: {
    backgroundColor: '#19398A',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    width: 200,
    alignSelf: 'center',
    marginBottom: 20
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 20,
  },
});