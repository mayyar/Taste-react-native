const baseUrl = `http://localhost:5000/`;

export async function createUser(username, password, country, flavor) {
  const apiUrl = baseUrl + `users`;
  saltyValue = 0;
  spicyValue = 0;
  sourValue = 0;
  sweetValue = 0;
  if (flavor.includes('Salty')) {
    saltyValue = 1;
  }
  if (flavor.includes('Spicy')) {
    spicyValue = 1;
  }
  if (flavor.includes('Sour')) {
    sourValue = 1;
  }
  if (flavor.includes('Sweet')) {
    sweetValue = 1;
  }
  userId = -1;
  await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password,
      country: country,
      tastePref: {
        salty: saltyValue,
        spicy: spicyValue,
        sour: sourValue,
        sweet: sweetValue
      }
    })
  })
    .then(res => res.json())
    .then(json => {
      console.log('Created user: ' + json.username + ', user id: ' + json.id);
      userId = json.id;
    })
    .catch((error) => {
      console.error(error);
    });
    return userId;
}

export function createRating(userId, placeId, rating) {
  const apiUrl = baseUrl + `ratings`;
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: userId + '',
      googlePlaceId: placeId,
      rating: rating
    })
  })
    .then(res => res.json())
    .then(json => console.log('Created rating: ' + json.rating + ', googlePlaceId: ' + json.googlePlaceId))
    .catch((error) => {
      console.error(error);
    });
}

export async function getRatingsByPref(googlePlaceIds, country, flavor) {
  const apiUrl = baseUrl + `ratings/pref`;
  saltyValue = 0;
  spicyValue = 0;
  sourValue = 0;
  sweetValue = 0;
  if (flavor.includes('Salty')) {
    saltyValue = 1;
  }
  if (flavor.includes('Spicy')) {
    spicyValue = 1;
  }
  if (flavor.includes('Sour')) {
    sourValue = 1;
  }
  if (flavor.includes('Sweet')) {
    sweetValue = 1;
  }
  let ratingsByPref = [];
  await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      googlePlaceIds: googlePlaceIds,
      country: country,
      tastePref: {
        salty: saltyValue,
        spicy: spicyValue,
        sour: sourValue,
        sweet: sweetValue
      }
    })
  })
    .then(res => res.json())
    .then(json => {
      console.log('Get location rating: ' + json[0].rating + ', tastePref: ' + json[0].tastePref);
      ratingsByPref = json;
    })
    .catch((error) => {
      console.error(error);
    });
    return ratingsByPref;
}
