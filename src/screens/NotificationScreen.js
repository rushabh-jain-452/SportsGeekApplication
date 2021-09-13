import React from 'react';
import { View, Text, Button, StyleSheet, StatusBar } from 'react-native';
// import { useTheme } from '@react-navigation/native';

const NotificationScreen = ({ navigation }) => {

  // const { colors } = useTheme();

  const theme = useTheme();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1F4F99" barStyle={theme.dark ? "light-content" : "dark-content"} />
      <Text style={{ color: '#000' }}>Notification Screen</Text>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});