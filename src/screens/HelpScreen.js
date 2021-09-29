import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HelpScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={() => { navigation.goBack() }}><Icon name="arrow-left-circle" color="#19398A" size={40} /></TouchableOpacity>
      <Text style={styles.heading}>Rules</Text>
      <Text style={styles.listitem}>1.Register by putting Rs 100.</Text>
      <Text style={styles.listitem}>2.You will get Rs 100 X 5 = 500 points.</Text>
      <Text style={styles.listitem}>3.On each match, you can bet minimum 10 points on any team (few matches have higher minimum points).</Text>
      <Text style={styles.listitem}>4.If you do not bet on any match, your bet will be put automatically on the losing team of 10 points.</Text>
      <Text style={styles.listitem}>5.Simple principle <Text style={styles.bold}>"Winners win what losers lose in that match, in the same proportion of their bet"</Text>.</Text>
      <Text style={styles.listitem}>6.Losers do not get anything from losing match.</Text>
      <Text style={styles.listitem}>7.You can see your points in the Profile Screen.</Text>
      <Text style={styles.listitem}>8.You can bet anytime, update any number of times and any amount until the match has started.</Text>
      <View style={styles.border}></View>
      <Text style={styles.heading2}>Distribution among winners at the end of IPL Season</Text>
      <Text style={styles.listitem2}>Once all the matches are over, the top 3 winners will get amount divided in the proportion of their winning shares. The amount to be divided will be the total collection for this season.</Text>
      <Text style={styles.listitem2}>If there are 30 participants, then the total amount will be = Rs 100 X 30 = 3000.</Text>
      <Text style={styles.listitempadding}>If the top 3 winners have points as 2800, 1000, 700, then the top winner would get</Text>
      <Text style={styles.listitempadding}>= (2800 / (2800 + 1000 +  700)) * 3000</Text>
      <Text style={styles.listitempadding}>= (2800 / 4500) * 3000</Text>
      <Text style={styles.listitem2}>= 1866</Text>
      <Text style={styles.listitem2}><Text style={styles.bold}>Note : </Text>The final few matches may have bet restriction to 20 % of their balance amount.</Text>
      <View style={styles.border}></View>
      <Text style={styles.heading2}>Terms and Conditions</Text>
      <Text style={styles.listitem2}>All the players would be bound by the terms and conditions of the game. In case of any discrepancy or dispute, the organizer's decision will be final and binding :)</Text>
      <View style={{ marginTop: 20 }}></View>
      {/* <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
      /> */}
      <View style={{ marginTop: 100 }}></View>
    </ScrollView>
  );
};

export default HelpScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold'
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  },
  listitempadding: {
    paddingLeft: 10
  },
  listitem: {
    paddingLeft: 10,
    marginBottom: 3
  },
  listitem2: {
    paddingLeft: 10,
    marginBottom: 4
  },
  bold: {
    fontWeight: 'bold'
  },
  border: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'black',
    width: '100%',
    height: 1
  },
});