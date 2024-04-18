import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native';

export default function App() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-xl">Hello World</Text>
            <MapView className='h-[400px] w-full'
                initialRegion={{
                    latitude: 43.471281,
                    longitude: -80.542162,
                    latitudeDelta: 0.0122,
                    longitudeDelta: 0.0121,
                }}
            />
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
