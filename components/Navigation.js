import React from 'react'
import { View, StyleSheet } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const NavigationScreen = ({ route, navigation }) => {
    const { origin, destination } = route.params;
    const GOOGLE_MAPS_APIKEY = "please-replace-with-real—google-place-api-key";

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={{
                    latitude: 37.3318456,
                    longitude: -122.0296002,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}>
                <MapViewDirections
                    apikey={GOOGLE_MAPS_APIKEY}
                    origin={origin}
                    destination={destination}
                    strokeWidth={3}
                    strokeColor="hotpink"
                    optimizeWaypoints
                    onStart={(params) => {
                        console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                    }}
                    onError={(errorMessage) => {
                        console.log(`GOT AN ERROR: ${errorMessage}`);
                    }}
                />
            </MapView>
        </View>
    );
}

export default NavigationScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
