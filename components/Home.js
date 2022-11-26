import React, {useState, useEffect} from 'react';
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
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getPlaces} from '../api/MapAPI';
import {createUser} from '../api/APIUtils';
import StarRating from './StarRating';
import ReviewPage from './ReviewPage';
import OpenURLButton from './OpenURLButton';
import {Platform, PermissionsAndroid} from 'react-native';

import Geolocation from 'react-native-geolocation-service';

const {width, height} = Dimensions.get('window');
const CARD_HEIGHT = 290;
const CARD_WIDTH = width * 0.8;

const HomeScreen = ({route, navigation}) => {
  const initMapState = {
    lat: 33.7767,
    long: -84.3923,
    places: [],
  };
  const initUserAccountState = {
    username: '',
    password: '',
    country: '',
    tastePref: [],
  };
  const [userAccountState, setUserAccountState] =
    useState(initUserAccountState);
  const [searchRestaurant, setSearchRestaurant] = useState('Restaurant');
  const [searchCountry, setSearchCountry] = useState('');
  const [mapState, setMapState] = useState(initMapState);
  const [userId, setUserId] = useState(-1);
  const [filter, setFilter] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [flavors, setFlavors] = useState([]);
  const options = ['Salty', 'Spicy', 'Sweet', 'Greasy', 'Sour'];
  const [detail, setDetail] = useState(false);
  const [cardID, setCardID] = useState(0);
  const [register, setRegister] = useState(true);
  const [background, setBackground] = useState(false);
  const [reviewPage, setReviewPage] = useState(false);
  const [confirmPassword, onChangeConfirmPassword] = useState('');
  const [registerError, onChangeRegisterError] = useState('');
  const [inputText, onChangeInputText] = useState('');
  const [location, setLocation] = useState([]);
  const phone = 4048942000;

  // useEffect(() => {
  //   async function requestPermissions() {
  //     if (Platform.OS === 'ios') {
  //       Geolocation.requestAuthorization();
  //       Geolocation.setRNConfiguration({
  //         skipPermissionRequests: false,
  //         authorizationLevel: 'whenInUse',
  //       });
  //     }

  //     if (Platform.OS === 'android') {
  //       await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       );
  //     }
  //   }
  // });

  function getFilterResults(filterSkip, keyword) {
    Promise.all([getPlaces(filterSkip, keyword, searchCountry, flavors)]).then(
      responses => {
        setMapState(responses[0]);
      },
    );
  }

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
          latitude: mapState.lat,
          longitude: mapState.long,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        {mapState.places.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.name}
            description={'Avg rating: ' + marker.rating}
          />
        ))}
      </MapView>
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search here"
          placeholderTextColor="#000"
          autoCapitalize="none"
          onChangeText={newText => setSearchRestaurant(newText)}
          style={{flex: 1, padding: 0}}
          onSubmitEditing={() => {
            getFilterResults(false, searchRestaurant);
            setFilter(false);
            setSubmit(true);
          }}
        />
        <TouchableOpacity onPress={() => {setFilter(!filter); setSubmit(false);}}>
          <Ionicons name="search" size={20} />
        </TouchableOpacity>
      </View>

      {register ? (
        <View style={styles.containerWithBackground}>

          <View style={{flexDirection: 'row', margin: 10}}>
            <Text style={{fontWeight: 'bold', fontSize: 15}}>Register</Text>
          </View>

          <View style={{flexDirection: 'row', margin: 10}}>
            <Text>* Required</Text>
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="Username*"
              // placeholderTextColor="#000"
              autoCapitalize="none"
              onChangeText={newText => (userAccountState.username = newText)}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="Password*"
              // placeholderTextColor="#000"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={newText => (userAccountState.password = newText)}
              secureTextEntry={true}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password*"
              // placeholderTextColor="#000"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={onChangeConfirmPassword}
              value={confirmPassword}
            />
          </View>

          <View style={styles.inputView}>
            <TouchableOpacity
              style={[styles.borderButton, {flex: 1, marginVertical: 10, padding: 10, borderRadius: 20}]}
              onPress={() => {
                if (confirmPassword === userAccountState.password
                    && userAccountState.username.length != 0
                    && userAccountState.password.length != 0) {
                  setRegister(!register);
                  setBackground(!background);
                  onChangeConfirmPassword('');
                  onChangeRegisterError('');
                }
                else {
                  onChangeRegisterError('Invalid username or password!');
                }
              }}
            >
              <Text style={styles.borderButtonText}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.inputView, {justifyContent: 'center',}]}>
            <Text style={{color: 'red',}}>
              {`${registerError}`}
            </Text>
          </View>
        </View>
      ) : null}

      {background ? (
        <View style={styles.containerWithBackground}>

          <View style={{flexDirection: 'row', margin: 10}}>
            <Text style={{fontWeight: 'bold', fontSize: 15}}>Background</Text>
          </View>

          <View
            style={{flexDirection: 'row', marginLeft: 10, marginBottom: 10}}>
            <Text>* Required</Text>
          </View>

          <View
            style={{flexDirection: 'row', marginLeft: 10, marginBottom: 10}}>
            <Text>
              In order to make your ratings more meaningful, we invite you to
              provide the following information:
            </Text>
          </View>

          <View style={{flexDirection: 'column', marginLeft: 10}}>
            <Text>Locations *</Text>
            <Text style={{color: '#808080', fontSize: 12,}}>Your preferred locations' flavor{'\n'}</Text>
          </View>

          <View style={{flexDirection: 'column', marginLeft: 10}}>
            <View style={{flexDirection: 'row'}}>
              {Array.isArray(location)
                ? location.map(tag => (
                    <TouchableOpacity
                      style={styles.buttonTag}
                      key={tag}
                      onPress={() => {
                        setLocation(location =>
                          location.filter((item, index) => item !== tag),
                        );
                      }}>
                      <Text style={{}}>{tag}</Text>
                    </TouchableOpacity>
                  ))
                : null}
            </View>
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              onChangeText={onChangeInputText}
              onSubmitEditing={() => {
                if (location.length < 3)
                  setLocation(prevArray => [...prevArray, inputText]);
                onChangeInputText('');
                userAccountState.country = inputText;
              }}
              value={inputText}
              placeholder="Press enter to add"
            />
          </View>

          <View style={{flexDirection: 'column', marginLeft: 10, marginTop: 10}}>
            <Text>Taste preferences * </Text>
            <Text style={{color: '#808080', fontSize: 12,}}>Your preferred taste flavor</Text>
          </View>

          <View style={{flexDirection: 'column', margin: 10}}>
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

          <View style={styles.inputView}>
            <TouchableOpacity
              style={[styles.borderButton, {flex: 1, marginVertical: 10, padding: 10, borderRadius: 20}]}
              onPress={() => {
                userAccountState.tastePref = flavors;
                const {username, password, country, tastePref} = userAccountState;
                Promise.all([
                  createUser(username, password, country, tastePref),
                ]).then(responses => {
                  setUserId(responses[0]);
                });

                setBackground(!background);
              }}
            >
              <Text style={styles.borderButtonText}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {filter ? (
        <View style={styles.formContainer}>
          <View style={styles.textContent}>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Text style={{fontSize: 12,}}>Search restaurants & get ratings you like.</Text>
            </View>

            <Text style={{fontWeight: 'bold', fontSize: 12, paddingBottom: 12}}>
              Preferred Locations' Flavor
            </Text>

            <View style={{flexDirection: 'column', marginLeft: 0}}>
              <View style={{flexDirection: 'row'}}>
                {Array.isArray(location)
                  ? location.map(tag => (
                      <TouchableOpacity
                        style={[styles.buttonTag, {backgroundColor: 'coral',}]}
                        key={tag}
                        onPress={() => {
                          setLocation(location =>
                            location.filter((item, index) => item !== tag),
                          );
                        }}>
                        <Text style={{color: 'white', fontWeight: 'bold',}}>{tag}</Text>
                      </TouchableOpacity>
                    ))
                  : null}
              </View>
            </View>

            <View style={{flexDirection: 'column', marginLeft: 0}}>
              <TextInput
                style={styles.input}
                onChangeText={onChangeInputText}
                onSubmitEditing={() => {
                  if (location.length < 3)
                    setLocation(prevArray => [...prevArray, inputText]);
                  onChangeInputText('');
                  setSearchCountry(inputText);
                }}
                value={inputText}
                placeholder="Press enter to add"
              />
            </View>

            <Text style={{fontWeight: 'bold', fontSize: 12}}>Preferred Taste Flavor</Text>

            <View>
              {options.map((option, index) => (
                <View key={index} style={styles.flavor}>
                  <TouchableOpacity
                    style={[styles.checkbox, {borderColor: 'coral',}]}
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
                style={[styles.filterButton, {backgroundColor: 'coral',}]}
                onPress={() => {
                  getFilterResults(true, searchRestaurant);
                  setFilter(false);
                  setSubmit(true);
                }}>
                <Text style={styles.textFilter}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, {backgroundColor: 'coral',}]}
                onPress={() => {
                  getFilterResults(false, searchRestaurant);
                  setFilter(false);
                  setSubmit(true);
                }}>
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
          {mapState.places.map((marker, index) => (
            <View style={styles.card} key={index}>
              <Image
                source={{uri: marker.photoUrl}}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardTitle}>
                  {marker.name}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Ionicons
                    name="checkmark"
                    size={15}
                    style={{color: 'green'}}
                  />
                  <Text
                    numberOfLines={1}
                    style={{fontSize: 11, paddingTop: 2}}>{`Dine-in`}</Text>
                  <Ionicons
                    name="checkmark"
                    size={15}
                    style={{color: 'green', marginLeft: 5}}
                  />
                  <Text
                    numberOfLines={1}
                    style={{fontSize: 11, paddingTop: 2}}>{`Takeout`}</Text>
                  <Ionicons
                    name="checkmark"
                    size={15}
                    style={{color: 'green', marginLeft: 5}}
                  />
                  <Text
                    numberOfLines={1}
                    style={{fontSize: 11, paddingTop: 2}}>{`Delivery`}</Text>
                </View>

                <Text numberOfLines={1} style={{fontSize: 11, paddingTop: 2}}>
                  {`Mon-Fri 11:00am-9:00pm`}
                </Text>

                <Text numberOfLines={1} style={{fontSize: 11, paddingTop: 2}}>
                  {`Location Rating: ` + marker.locationRating}
                </Text>

                <StarRating
                  ratings={marker.rating}
                  reviews={Math.floor(Math.random() * 100) + 50}
                />
                <View style={styles.button}>
                  <TouchableOpacity
                    onPress={() => {
                      setCardID(index);
                      setDetail(!detail);
                    }}
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

      {detail ? (
        <View style={[styles.container, {justifyContent: 'flex-start'}]}>
          <View style={[styles.detailContainer, {flex: 1}]}>
            <TouchableOpacity onPress={() => setDetail(!detail)}>
              <Text style={[styles.textSign, {color: 'green'}]}>X</Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.detailContainer,
              {flex: 10, justifyContent: 'center', alignItems: 'center'},
            ]}>
            <Image
              source={{uri: mapState.places[cardID].photoUrl}}
              style={styles.detailImage}
              resizeMode="cover"
            />
          </View>

          <View style={[styles.detailContainer, {flex: 8}]}>
            <Text style={{fontSize: 20, paddingBottom: 10}}>
              {mapState.places[cardID].name}
            </Text>

            <View style={styles.detailItemContainer}>
              <Text style={styles.textDetailTitle}>Rating: </Text>
              <Text style={styles.textDetail}>
                {mapState.places[cardID].rating}
              </Text>
            </View>

            <View style={styles.detailItemContainer}>
              <Text style={styles.textDetailTitle}>Location rating: </Text>
              <Text style={styles.textDetail}>
                {mapState.places[cardID].locationRating}
              </Text>
            </View>

            <View style={styles.detailItemContainer}>
              <Text style={styles.textDetailTitle}>Taste: </Text>
              <Text style={styles.textDetail}>
                {mapState.places[cardID].tastePrefString}
              </Text>
            </View>

            <View style={styles.detailItemContainer}>
              <Text style={styles.textDetailTitle}>Address: </Text>
              <Text style={styles.textDetail}>
                {mapState.places[cardID].vicinity}
              </Text>
            </View>

            <View style={styles.detailItemContainer}>
              <Text style={styles.textDetailTitle}>Opens: </Text>
              <Text style={styles.textDetail}>Mon-Fri 11:00am-9:00pm</Text>
            </View>

            <View style={styles.detailItemContainer}>
              <Text style={styles.textDetailTitle}>Price: </Text>
              <Text style={styles.textDetail}>$20-$30</Text>
            </View>

            <View style={styles.detailItemContainer}>
              <Text style={styles.textDetailTitle}>Phone: </Text>
              <OpenURLButton
                textStyle={styles.urlButtonText}
                url={`${Platform.OS === 'ios' ? 'telprompt:' : 'tel:'}${phone}`}>
                {`${phone}`}
              </OpenURLButton>
            </View>
          </View>

          <View
            style={[
              styles.detailContainer,
              {
                flex: 4,
                alignItems: 'flex-start',
                justifyContent: 'space-around',
                flexDirection: 'row',
              },
            ]}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Review', {
                  userId,
                  googlePlaceId: mapState.places[cardID].id,
                });
              }}
              style={styles.borderButton}>
              <Text style={styles.borderButtonText}>Write a Review</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Navigation', {
                  origin: {latitude: mapState.lat, longitude: mapState.long},
                  destination: mapState.places[cardID].latlng,
                });
              }}
              style={styles.borderButton}>
              <Text style={styles.borderButtonText}>Navigation</Text>
            </TouchableOpacity>

            <OpenURLButton
              style={styles.borderButton}
              textStyle={styles.borderButtonText}
              url={`${
                Platform.OS === 'ios'
                  ? 'maps:0,0?q=' +
                    mapState.places[cardID].name +
                    '@' +
                    mapState.places[cardID].latlng
                  : 'geo:0,0?q=' +
                    mapState.places[cardID].latlng +
                    '(' +
                    mapState.places[cardID].name +
                    ')'
              }`}>
              {`Open Maps`}
            </OpenURLButton>
          </View>
        </View>
      ) : null}

      {reviewPage ? <ReviewPage onChangeValue={setReviewPage} /> : null}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerWithBackground: {
    flex: 1,
    backgroundColor: 'white', 
    padding: 10,
  },
  searchBox: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? 20 : 20,
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '90%',
    // height: '5%',
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
  borderButton: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    borderColor: 'green',
    borderWidth: 1,
  },
  borderButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
  },
  detailContainer: {
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
  },
  detailItemContainer: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  textDetailTitle: {
    // color: 'black',
    fontWeight: 'bold',
  },
  textDetail: {
    // color: 'black',
  },
  urlButtonText: {
    color: 'blue',
  },
  detailImage: {
    flex: 1,
    aspectRatio: 1,
    // width: 2,
    // height: ,
    // alignSelf: 'stretch',
    // resizeMode: 'contain',
    // alignSelf: 'center',
  },
  inputView: {
    flexDirection: 'row', 
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
  },
  buttonTag: {
    backgroundColor: 'powderblue',
    padding: 4,
    borderRadius: 10,
    marginRight: 5,
  },
});
