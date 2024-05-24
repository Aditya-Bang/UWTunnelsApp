import React, { useRef, useState, useEffect } from 'react';
import MapView, { Marker, Polygon, Polyline } from 'react-native-maps';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
// import { Feather, AntDesign } from '@expo/vector-icons';
// import { PROVIDER_GOOGLE } from 'react-native-maps';
import mapStyles from '../public/mapStyles.json'
import locations from '../public/locations.json'
import tunnels from '../public/tunnels.json'
// import { SafeAreaView } from 'react-native-safe-area-context';

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
    const [tunnelPath, setTunnelPath] = useState([]);
    const [adjl, setAdjl] = useState({});
    const [noRoute, setNoRoute] = useState(false);

    function myToString(x) {
        if (!x) return null;
        else return x.toString();
    }

    function dijkstra(graph, startNode, endNode) {

        if (!startNode || !endNode) return;

        // Initialize distances object with infinity for all nodes
        const distances = {};
        for (let node in graph) {
            distances[node] = Infinity;
        }
        distances[startNode] = 0;

        // Initialize priority queue with start node
        const priorityQueue = [startNode];

        // Keep track of visited nodes
        const visited = {};

        // While there are nodes to visit in the priority queue
        while (priorityQueue.length > 0) {
            // Extract the node with the smallest distance from the priority queue
            const currentNode = priorityQueue.shift();

            // If the current node is the end node, we're done
            if (currentNode === endNode) {
                break;
            }

            // If the current node has already been visited, skip it
            if (visited[currentNode]) {
                continue;
            }
            visited[currentNode] = true;

            // Visit all neighboring nodes
            for (let neighbor in graph[currentNode]) {
                const distanceToNeighbor = distances[currentNode] + graph[currentNode][neighbor].weight;
                // If the distance to the neighbor is shorter than the current known distance
                if (distanceToNeighbor < distances[neighbor]) {
                    distances[neighbor] = distanceToNeighbor;
                    // Add the neighbor to the priority queue
                    priorityQueue.push(neighbor);
                    // Sort the priority queue based on distances
                    priorityQueue.sort((a, b) => distances[a] - distances[b]);
                }
            }
        }

        // Reconstruct the shortest path
        if (!distances[endNode]) {
            setTunnelPath([]);
            setNoRoute(true);
            return;
        }
        const shortestPath = [];
        const tunnelCoords = [];
        let currentNode = endNode;
        while (currentNode !== startNode) {

            shortestPath.unshift(currentNode);

            for (let neighbor in graph[currentNode]) {

                if (distances[currentNode] === distances[neighbor] + graph[neighbor][currentNode].weight) {
                    tunnelCoords.unshift(graph[neighbor][currentNode].coordinates);
                    currentNode = neighbor;
                    break;
                }
            }
        }
        shortestPath.unshift(startNode);


        // Return the shortest path and its distance
        setTunnelPath(tunnelCoords);
        setNoRoute(false);

        // change region
        var leftMin = Infinity;
        var rightMax = -Infinity;
        var topMax = -Infinity;
        var bottomMin = Infinity;
        var latCenter, longCenter, deltaPath;

        tunnelCoords.forEach((tunnelInPath) => {
            tunnelInPath.forEach((segment) => {
                leftMin = Math.min(segment.latitude, leftMin);
                rightMax = Math.max(segment.latitude, rightMax);
                topMax = Math.max(segment.longitude, topMax);
                bottomMin = Math.min(segment.longitude, bottomMin);
            })
        })

        latCenter = (rightMax + leftMin) / 2;
        longCenter = (topMax + bottomMin) / 2;
        deltaPath = Math.max(rightMax - leftMin, topMax - bottomMin) * 1.25;

        mapRef.current.animateToRegion({ latitude: latCenter, longitude: longCenter, latitudeDelta: deltaPath, longitudeDelta: deltaPath }, 1 * 1000)

    }

    const findRoute = () => {
        dijkstra(adjl, value1.toString(), value2.toString());

    }

    useEffect(() => {
        const myAdjl = {};
        tunnels.forEach(tunnel => {
            if (!myAdjl[tunnel.a]) {
                myAdjl[tunnel.a] = {};
            }
            if (!myAdjl[tunnel.b]) {
                myAdjl[tunnel.b] = {};
            }
            myAdjl[tunnel.a][tunnel.b] = { weight: tunnel.weight, id: tunnel.id, coordinates: tunnel.coordinates };
            myAdjl[tunnel.b][tunnel.a] = { weight: tunnel.weight, id: tunnel.id, coordinates: tunnel.coordinates };
        })

        setAdjl(myAdjl);
    }, [])

    return (
        <View className="flex-1 h-full w-full bg-gray-900">
            <View className="z-10 pl-2 pr-2 mb-2 mt-[75px] w-full">
                <Dropdown
                    className={`w-full shadow-md z-10 bg-white h-[50px] border border-gray-300 rounded-2xl px-[8px] ${(value1 || isFocus1) && "border-blue-700"}`}
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

                    }}
                    renderLeftIcon={() => (
                        <Text style={styles.selectedTextStyle}>
                            From:&nbsp;
                        </Text>
                    )}
                />
            </View>
            <View className="z-10 pl-2 pr-2 w-full">
                <Dropdown
                    className={`w-full h-[50px] shadow-md z-10 bg-white border border-gray-300 rounded-2xl px-[8px] ${(value2 || isFocus2) && "border-blue-700"}`}
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

                    }}
                    renderLeftIcon={() => (
                        <Text className="" style={styles.selectedTextStyle}>
                            To:&nbsp;
                        </Text>
                    )}
                />
            </View>


            <TouchableOpacity
                disabled={((!value1 || !value2) || (value1 == value2))}
                className={`p-4 bg-blue-500 m-2 items-center z-10 shadow ${((!value1 || !value2) || (value1 == value2)) && "bg-blue-200"} rounded-2xl`}
                onPress={() => findRoute()}
            >
                <Text className="text-black dark:text-white uppercase">Find Route</Text>
            </TouchableOpacity>
            {noRoute && <Text className="z-10 w-full text-red-500 text-center">No Route Available</Text>}

            <MapView className='absolute z-0 h-full w-full'
                ref={mapRef}

                initialRegion={initialRegion}
                onRegionChange={(region) => setRegion(region)}
            >
                {locations.map((location, index) => (
                    <View key={`stuff ${index}`}>
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
                            />
                            :
                            <></>
                        }
                    </View>
                ))}

                {tunnelPath.map((tunnelCoord, index) => {
                    return (<Polyline
                        key={`tunnel polyline ${index}`}
                        coordinates={tunnelCoord}
                        strokeColor='#000000'
                        strokeWidth={5}
                        lineDashPattern={[1]}
                    />)
                })}
            </MapView>
            <View className="absolute z-10 right-5 bottom-5">
                <Pressable className="m-2 p-4 bg-blue-500 rounded-2xl shadow" onPress={() => { mapRef.current.animateToRegion(initialRegion, 1 * 1000) }}>
                    <Text className="text-black uppercase">
                        Go home
                    </Text>
                </Pressable>

            </View>
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