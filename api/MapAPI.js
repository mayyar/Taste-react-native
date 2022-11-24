import Geolocation from '@react-native-community/geolocation';
import {getRatingsByPref} from '../api/APIUtils';
import Config from 'react-native-config';

export function getCurrentLocation() {
  return new Promise((resolve, reject) =>
    Geolocation.getCurrentPosition(resolve, reject),
  );
}

function getPlacesUrl(keyword, lat, long, radius, type, apiKey) {
  const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`;
  const location = `location=${lat},${long}&radius=${radius}`;
  const typeData = `&keyword=${keyword}&types=${type}`;
  const api = `&key=${apiKey}`;
  return `${baseUrl}${location}${typeData}${api}`;
}

export async function getPlaces(filterSkip, keyword, searchCountry, flavors) {
  const apiKey = Config.REACT_APP_API_KEY;
  console.log('Key in MapAPI: ', apiKey);
  let position = await getCurrentLocation(),
    {coords} = position;
  const markers = [];
  const markersSkip = [];
  const url = getPlacesUrl(
    keyword,
    coords.latitude,
    coords.longitude,
    1500,
    'restaurant',
    apiKey,
  );
  let googlePlaceIds = [];
  let placeIdToMarker = {};
  await fetch(url)
    .then(res => res.json())
    .then(res => {
      res.results.map((element, index) => {
        const marketObj = {};
        marketObj.id = element.place_id;
        marketObj.name = element.name;
        if ('photos' in element) {
          marketObj.photoUrl = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${element.photos[0].photo_reference}&sensor=false&maxheight=${element.photos[0].height}&maxwidth=${element.photos[0].width}&key=${apiKey}`;
        }
        marketObj.rating = element.rating;
        marketObj.vicinity = element.vicinity;
        marketObj.latlng = {
          latitude: element.geometry.location.lat,
          longitude: element.geometry.location.lng,
        };
        markersSkip.push(marketObj);
        placeIdToMarker[marketObj.id] = marketObj;
        googlePlaceIds.push(marketObj.id);
      });
    });

  let state = {
    lat: coords.latitude,
    long: coords.longitude,
    places: [],
  };

  if (filterSkip) {
    state.places = markersSkip;
  } else {
    let ratingsByPref = await getRatingsByPref(
      googlePlaceIds,
      searchCountry,
      flavors,
    );
    for (let i = 0; i < ratingsByPref.length; i++) {
      let ratingByPref = ratingsByPref[i];
      placeIdToMarker[ratingByPref.googlePlaceId].locationRating =
        ratingByPref.rating;
      placeIdToMarker[ratingByPref.googlePlaceId].country =
        ratingByPref.country;
      let tastePrefString = '';
      for (const [taste, value] of Object.entries(ratingByPref.tastePref)) {
        if (value == 1) {
          tastePrefString += taste + ' ';
        }
      }
      placeIdToMarker[ratingByPref.googlePlaceId].tastePrefString =
        tastePrefString;
      markers.push(placeIdToMarker[ratingByPref.googlePlaceId]);
    }
    state.places = markers;
  }

  return state;
}
