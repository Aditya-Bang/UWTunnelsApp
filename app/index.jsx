import React, { useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Polygon } from 'react-native-maps';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Feather, AntDesign } from '@expo/vector-icons';
import mapStyles from '../public/mapStyles.json'
import locations from '../public/locations.json'

// NEED Polygons for building outlines

const initialRegion = {
    latitude: 43.47136232108102,
    longitude: -80.5454821139574,
    latitudeDelta: 0.012199865807744459,
    longitudeDelta: 0.016516372561468984,
}


export default function App() {
    // states of mapview
    const mapRef = useRef(null);
    const [region, setRegion] = useState(initialRegion);

    // values for inputs buttons
    const [value1, setValue1] = useState(null);
    const [isFocus1, setIsFocus1] = useState(false);
    const [value2, setValue2] = useState(null);
    const [isFocus2, setIsFocus2] = useState(false);

    return (
        <View className="flex-1 gap-2 p-3 items-center justify-center bg-gray-900">
            <Dropdown
                className={`w-full bg-white h-[50px] border border-gray-300 rounded-md px-[8px] ${(value1 || isFocus1) && "border-blue-700"}`}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={locations}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus1 ? 'Select item' : '...'}
                searchPlaceholder="Search..."
                value={value1}
                onFocus={() => setIsFocus1(true)}
                onBlur={() => setIsFocus1(false)}
                onChange={item => {
                    setValue1(item.value);
                    setIsFocus1(false);
                    console.log("value1", value1)
                }}
                renderLeftIcon={() => (
                    <Text style={styles.selectedTextStyle}>
                        From:&nbsp;
                    </Text>
                )}
            />
            <Dropdown
                className={`w-full h-[50px] bg-white border border-gray-300 rounded-md px-[8px] ${(value2 || isFocus2) && "border-blue-700"}`}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={locations}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus2 ? 'Select item' : '...'}
                searchPlaceholder="Search..."
                value={value2}
                onFocus={() => setIsFocus2(true)}
                onBlur={() => setIsFocus2(false)}
                onChange={item => {
                    setValue2(item.value);
                    setIsFocus2(false);
                    console.log("value2", value2)
                }}
                renderLeftIcon={() => (
                    <Text className="" style={styles.selectedTextStyle}>
                        To:&nbsp;
                    </Text>
                )}
            />

            <MapView className='h-[400px] w-full'
                ref={mapRef}
                customMapStyle={mapStyles}
                provider={PROVIDER_GOOGLE}

                initialRegion={initialRegion}
                onRegionChange={(region) => setRegion(region)}
            >
                {locations.map((location, index) => (
                    <>
                        {(location.value == value1) ?
                            <Marker
                                key={`marker from ${index}`}
                                coordinate={location.markerCoordinate}
                                title={location.label}
                                pinColor="#AAFF00"
                            />
                            : <></>
                        }
                        {(location.value == value2) ?
                            <Marker
                                key={`marker to ${index}`}
                                coordinate={location.markerCoordinate}
                                title={location.label}
                                pinColor="#EE4B2B"
                            />
                            : <></>
                        }
                        



                        {location.polygon ?
                            <Polygon
                                key={`building ${index}`}
                                coordinates={location.polygon.coordinates}
                                fillColor={location.polygon.color}
                                strokeColor="#27f"
                                strokeWidth={2}
                                tappable={true}
                                onPress={() => console.log("Pressed")} />
                            :
                            <></>
                        }

                    </>
                ))}





            </MapView>

            <Pressable className="p-4 bg-blue-200 rounded-lg" onPress={() => { mapRef.current.animateToRegion(initialRegion, 1 * 1000) }}>
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
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});