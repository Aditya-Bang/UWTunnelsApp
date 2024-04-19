import React, { useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native';
import mapStyles from '../public/mapStyles.json'
import locations from '../public/locations.json'

const initialRegion = {
    latitude: 43.471281,
    longitude: -80.542162,
    latitudeDelta: 0.0122,
    longitudeDelta: 0.0121,
}


export default function App() {
    const mapRef = useRef(null);
    const [region, setRegion] = useState(initialRegion);

    const goHome = () => {
        mapRef.current.animateToRegion(initialRegion, 1 * 1000);
    };

    return (
        <View className="flex-1 items-center justify-center bg-white">
            <MapView className='h-[400px] w-full'
                ref={mapRef}
                customMapStyle={mapStyles}
                provider={PROVIDER_GOOGLE}

                initialRegion={initialRegion}
                onRegionChange={(region) => setRegion(region)}
            >
                {locations.map((location, index) => (
                    <Marker
                        key={index}
                        coordinate={location.coordinate}
                        title={location.name}
                    />
                ))}
            </MapView>

            <Pressable className="p-4 bg-blue-200 rounded-lg" onPress={goHome}>
                <Text className="text-black dark:text-white uppercase">
                    Go home
                </Text>
            </Pressable>
            <Text className='text-green-500'>Current latitude {region.latitude}</Text>
            <Text className='text-green-500'>Current longitude {region.longitude}</Text>
            <Text className='text-green-500'>Current latitudeDelta {region.latitudeDelta}</Text>
            <Text className='text-green-500'>Current longitudeDelta {region.longitudeDelta}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
