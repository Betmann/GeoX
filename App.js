import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import MapView,{Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const { width, height } = Dimensions.get('window');
const API_KEY = '8a828332cbd5eebc8d6c2eab72439cef'; // Substitua pela sua chave da API do OpenWeatherMap

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [loading, setLoading] = useState(true);

  const bounds = {
    north: -22.9138,
    south: -22.9145,
    west: -47.0687,
    east: -47.0679,
  };

  const fixedPoint1 = {
    latitude: -22.9140639,
    longitude: -47.068065,
  };

  const fixedPoint2 = {
    latitude: -22.9140600,
    longitude: -47.068000,
  };

  const calculatePosition = (latitude, longitude) => {
    if (!latitude || !longitude) return { top: '50%', left: '50%' };

    if (latitude < bounds.south || latitude > bounds.north || longitude < bounds.west || longitude > bounds.east) {
      return { top: '50%', left: '50%' };
    }

    const top = ((bounds.north - latitude) / (bounds.north - bounds.south)) * 100;
    const left = ((longitude - bounds.west) / (bounds.east - bounds.west)) * 100;

    return { top: `${top}%`, left: `${left}%` };
  };

  const fetchWeather = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`);
      setTemperature(response.data.main.temp);
    } catch (error) {
      setErrorMsg('Error fetching weather data');
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      Location.watchPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 200,
        distanceInterval: 0.1,
      }, (newLocation) => {
        const { latitude, longitude } = newLocation.coords;
        setLocation(newLocation.coords);
        setLatitude(latitude);
        setLongitude(longitude);
        fetchWeather(latitude, longitude);
        setLoading(false);
      });
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }
// cd GEOX
// NPX EXPO START
// A
// W
  return (
    <View style={styles.container}>
      <View style={styles.map}>
        {location && <View style={[styles.bolinha, calculatePosition(location.latitude, location.longitude)]} />}
        <View style={[styles.fixedPoint1, calculatePosition(fixedPoint1.latitude, fixedPoint1.longitude)]} />
        <View style={[styles.fixedPoint2, calculatePosition(fixedPoint2.latitude, fixedPoint2.longitude)]} />
      </View>
      <Text>Latitude: {latitude}</Text>
      <Text>Longitude: {longitude}</Text>
      <Text>Temperature: {temperature}°C</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  map: {
    position: 'relative',
    width: width - 40,
    height: height / 2,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 20,
  },
  bolinha: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'blue',
    borderRadius: 10,
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  fixedPoint1: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  fixedPoint2: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'green',
    borderRadius: 10,
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
});
