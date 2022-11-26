import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';

const LandingPage = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 3,
          justifyContent: 'space-evenly',
        }}>
        <View style={styles.items}>
          <Image
            source={require('../assets/resume.png')}
            style={styles.image}
          />
          <Text style={styles.textbox}>
            Provide your background (country/city) information
          </Text>
        </View>
        <View style={styles.items}>
          <Image
            source={require('../assets/search.png')}
            style={styles.image}
          />
          <Text style={styles.textbox}>
            Search restaurants and get ratings from people who share the same
            background or culture.
          </Text>
        </View>
        <View style={styles.items}>
          <Image
            source={require('../assets/rating.png')}
            style={styles.image}
          />
          <Text style={styles.textbox}>
            Share your ratings! People whose background are similar to you could
            benefit from it.
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={styles.borderButton}
          onPress={() => navigation.navigate('Taste')}>
          <Text style={styles.borderButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'aliceblue',
  },
  items: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginLeft: 30,
    marginRight: 30,
  },
  image: {
    width: 70,
    height: 70,
  },
  textbox: {
    width: '60%',
    borderWidth: 3,
    borderColor: 'green',
    borderRadius: 5,
    padding: 5,
    backgroundColor: 'white',
    fontSize: 15,
  },
  borderButton: {
    padding: 5,
    width: '50%',
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    borderColor: 'green',
    backgroundColor: 'green',
    marginBottom: 20,
  },
  borderButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
