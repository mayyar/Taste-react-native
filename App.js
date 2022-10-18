/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {markers} from './model/mapData';

const {width, height} = Dimensions.get('window');
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const App = () => {
  const initialMapState = {
    markers,
  };
  const [state, setState] = useState(initialMapState);
  const [filter, setFilter] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [flavors, setFlavors] = useState([]);
  const options = ['Salty', 'Spicy', 'Sweet', 'Greasy', 'Sour'];

  function pickFlavor(selectedFlavor) {
    if (flavors.includes(selectedFlavor)) {
      setFlavors(flavors.filter(flavor => flavor !== selectedFlavor));
      return;
    }
    setFlavors(flavors => flavors.concat(selectedFlavor));
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: 33.7767,
          longitude: -84.3923,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}></MapView>
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search here"
          placeholderTextColor="#000"
          autoCapitalize="none"
          style={{flex: 1, padding: 0}}
        />
        <TouchableOpacity onPress={() => setFilter(!filter)}>
          <Ionicons name="ios-search" size={20} />
        </TouchableOpacity>
      </View>
      {filter ? (
        <View style={styles.formContainer}>
          <View style={styles.textContent}>
            <Text style={{fontWeight: 'bold', fontSize: 15}}>
              Background Filter
            </Text>
            <View
              style={{
                flexDirection: 'row',
                margin: 10,
              }}>
              <Text>Country</Text>
              <TextInput
                placeholder=""
                placeholderTextColor="#000"
                autoCapitalize="none"
                style={{
                  flex: 1,
                  padding: 0,
                  marginLeft: 5,
                  borderBottomColor: '#000',
                  borderBottomWidth: 1,
                }}
              />
              <Ionicons name="ios-search" size={20} />
            </View>

            <Text style={{fontWeight: 'bold', fontSize: 15}}>Taste Filter</Text>

            <View>
              {options.map((option, index) => (
                <View key={index} style={styles.flavor}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => pickFlavor(option)}>
                    {flavors.includes(option) && (
                      <Text style={styles.check}>𐄂</Text>
                    )}
                  </TouchableOpacity>
                  <Text>{option}</Text>
                </View>
              ))}
            </View>

            <View style={styles.formButton}>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setSubmit(!submit)}>
                <Text style={styles.textFilter}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setSubmit(!submit)}>
                <Text style={styles.textFilter}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}

      {submit ? (
        <ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}>
          {state.markers.map((marker, index) => (
            <View style={styles.card} key={index}>
              <Image
                source={marker.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardTitle}>
                  {marker.title}
                </Text>
                <Text numberOfLines={1} style={styles.cardDescription}>
                  {marker.description}
                </Text>
                <View style={styles.button}>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={[
                      styles.signIn,
                      {
                        borderColor: 'green',
                        borderWidth: 1,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.textSign,
                        {
                          color: 'green',
                        },
                      ]}>
                      Detail
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '90%',
    height: '5%',
    alignSelf: 'center',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  formContainer: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? 100 : 40,
    width: '90%',
    // height: '30%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: {x: 2, y: -2},
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardTitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 12,
    color: '#444',
  },
  button: {
    alignItems: 'center',
    marginTop: 5,
  },
  signIn: {
    width: '100%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  textSign: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  formButton: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: 'green', //'#FF6347'
    borderRadius: 3,
    padding: 10,
    width: '30%',
  },
  textFilter: {
    color: '#fff',
    fontWeight: 'bold',
    // margin: 5,
  },
  options: {
    alignSelf: 'flex-start',
    // marginLeft: 50,
  },
  flavor: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  checkbox: {
    width: 15,
    height: 15,
    borderWidth: 2,
    borderColor: 'green',
    marginRight: 5,
  },
  check: {
    alignSelf: 'center',
  },
});
