import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ReviewPage = props => {
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
      <View style={styles.textContent}>
        <Text style={{fontWeight: 'bold', fontSize: 30, marginBottom: 20}}>
          Review
        </Text>

        <Text style={{fontWeight: 'bold', fontSize: 15, marginBottom: 10}}>
          Taste
        </Text>

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

        <View style={styles.ratings}>
          <Ionicons name="ios-star-outline" style={styles.star} size={30} />
          <Ionicons name="ios-star-outline" style={styles.star} size={30} />
          <Ionicons name="ios-star-outline" style={styles.star} size={30} />
          <Ionicons name="ios-star-outline" style={styles.star} size={30} />
          <Ionicons name="ios-star-outline" style={styles.star} size={30} />
        </View>

        <View style={styles.formButton}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => props.onChangeValue(false)}>
            <Text style={styles.textFilter}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => props.onChangeValue(false)}>
            <Text style={styles.textFilter}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ReviewPage;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? 100 : 40,
    width: '75%',
    height: '60%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    borderWidth: 3,
  },
  textContent: {
    flex: 2,
    padding: 10,
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
    width: '40%',
  },
  textFilter: {
    color: '#fff',
    fontWeight: 'bold',
    // margin: 5,
  },
  flavor: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  ratings: {
    flexDirection: 'row',
    // alignItems: 'center',
    alignSelf: 'center',
    margin: 10,
  },
  star: {
    color: '#FF8C00',
    marginLeft: 5,
    marginRight: 5,
  },
});
