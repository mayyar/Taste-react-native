import Geolocation from '@react-native-community/geolocation';

export function getCurrentLocation() {
  return new Promise((resolve, reject) =>
    Geolocation.getCurrentPosition(resolve, reject),
  );
}

function getPlacesUrl(lat, long, radius, type, apiKey) {
  const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`;
  const location = `location=${lat},${long}&radius=${radius}`;
  const typeData = `&types=${type}`;
  const api = `&key=${apiKey}`;
  return `${baseUrl}${location}${typeData}${api}`;
}

export async function getPlaces() {
  const apiKey = 'AIzaSyAknkMCF_NtwGapqISj2lsi3EsoG8l8lJc';
  let position = await getCurrentLocation(),
    {coords} = position;
  const markers = [];
  const url = getPlacesUrl(
    coords.latitude,
    coords.longitude,
    1500,
    'restaurant',
    apiKey,
  );
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
        markers.push(marketObj);
      });
    });
  const state = {
    lat: coords.latitude,
    long: coords.longitude,
    places: markers,
  };
  return state;
}
