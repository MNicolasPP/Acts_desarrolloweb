import React, { useState, useEffect, useRef } from 'react';
import {View,  Text,  TextInput,  FlatList,  ActivityIndicator,  StyleSheet,  SafeAreaView,  StatusBar,  Dimensions, TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');

const API_KEY = '897b4ec614157e1f112712bf63f81897';

export default function WeatherApp() {
  const [city, setCity] = useState('Hermosillo');
  const [weatherData, setWeatherData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDayView, setShowDayView] = useState(true);
  const timeoutRef = useRef(null);

  // Obterner el clima actual de X ciudad
  const fetchCurrentWeather = async (cityName) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setCurrentWeather(data);
      }
    } catch (err) {
      console.error('Error fetching current weather:', err);
    }
  };

  // Proximos pronosticos
  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data.list);
        await fetchCurrentWeather(cityName);
      } else {
        setError(data.message || 'City not found');
        setWeatherData([]);
      }
    } catch (err) {
      setError('Error connecting to server');
      setWeatherData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather('Hermosillo');
  }, []);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchWeather(city);
    }, 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [city]);

  // Cambia los colores segun el clima
  const getBackgroundGradient = () => {
    if (!currentWeather) return ['#87CEEB', '#4A90E2'];
    
    const weatherMain = currentWeather.weather[0].main.toLowerCase();
    const hour = new Date().getHours();
    const isNight = hour >= 19 || hour < 6;

    if (weatherMain.includes('clear')) {
      if (isNight) {
        return ['#1a1a2e', '#16213e'];
      } else {
        return ['#87CEEB', '#4A90E2'];
      }
    } else if (weatherMain.includes('cloud')) {
      return ['#B0C4DE', '#778899'];
    } else if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
      return ['#1e3a5f', '#2c5282'];
    } else if (weatherMain.includes('snow')) {
      return ['#E0EAFC', '#CFDEF3'];
    } else if (weatherMain.includes('thunderstorm')) {
      return ['#0f2027', '#2c3e50'];
    }
    
    return ['#87CEEB', '#4A90E2'];
  };

  // convertir el clima en emoji
  const getWeatherEmoji = (weatherMain) => {
    const weather = weatherMain.toLowerCase();
    if (weather.includes('clear')) return '☀️';
    if (weather.includes('cloud')) return '☁️';
    if (weather.includes('rain')) return '🌧️';
    if (weather.includes('snow')) return '❄️';
    if (weather.includes('thunderstorm')) return '⛈️';
    return '🌤️';
  };

  // Mensaje segun el clima
  const getMotivationalMessage = (temp, weather) => {
    const weatherMain = weather?.toLowerCase() || '';
    
    if (weatherMain.includes('rain')) {
      return "Don't forget your umbrella!";
    }
    if (weatherMain.includes('snow')) {
      return 'Bundle up well!';
    }
    if (weatherMain.includes('thunderstorm')) {
      return 'Better stay indoors.';
    }
    if (temp > 30) {
      return 'Perfect for the beach!';
    }
    if (temp > 25) {
      return 'Perfect to go out!';
    }
    if (temp > 15) {
      return 'A nice day awaits you.';
    }
    if (temp > 10) {
      return 'Bundle up well!';
    }
    return "It's very cold!";
  };

  // Para ver la hora normal
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Para ver dia normal
  const formatDay = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  // Obtiene las 5 proximos pronosticos
  const getHourlyData = () => {
    return weatherData.slice(0, 5);
  };

  // Obtener datos por de los proximos 5 dias
  const getDailyData = () => {
    const daily = [];
    const seenDays = new Set();
    
    weatherData.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!seenDays.has(date) && daily.length < 5) {
        seenDays.add(date);
        daily.push(item);
      }
    });
    
    return daily;
  };

  const gradientColors = getBackgroundGradient();

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: gradientColors[0] }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading weather...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: gradientColors[0] }]}>
        <Text style={styles.errorText}>{error}</Text>
        <TextInput
          style={styles.errorInput}
          value={city}
          onChangeText={setCity}
          placeholder="Try another city..."
          placeholderTextColor="#FFFFFF80"
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: gradientColors[0] }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Simulated gradient background */}
      <View style={[styles.gradient, { backgroundColor: gradientColors[1] }]} />
      
      {/* City input */}
      <View style={styles.cityInputContainer}>
        <TextInput
          style={styles.cityInput}
          value={city}
          onChangeText={setCity}
          placeholder="Search city..."
          placeholderTextColor="#FFFFFF80"
        />
      </View>

      {/* City name */}
      <Text style={styles.cityName}>
        {currentWeather?.name.toUpperCase() || city.toUpperCase()}
      </Text>

      {/* Main circle with temperature */}
      {currentWeather && (
        <View style={styles.mainCircle}>
          <Text style={styles.weatherCondition}>
            {currentWeather.weather[0].description.charAt(0).toUpperCase() + 
             currentWeather.weather[0].description.slice(1)}
          </Text>
          <Text style={styles.mainTemp}>
            {Math.round(currentWeather.main.temp)}°
          </Text>
          <Text style={styles.tempRange}>
            H:{Math.round(currentWeather.main.temp_max)}° L:{Math.round(currentWeather.main.temp_min)}°
          </Text>
        </View>
      )}

      {/* Motivational message */}
      <Text style={styles.motivationalText}>
        {currentWeather && getMotivationalMessage(
          currentWeather.main.temp, 
          currentWeather.weather[0].main
        )}
      </Text>

      {/* Toggle Day/Week */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, showDayView && styles.toggleButtonActive]}
          onPress={() => setShowDayView(true)}
        >
          <Text style={[styles.toggleText, showDayView && styles.toggleTextActive]}>
            DAY
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleButton, !showDayView && styles.toggleButtonActive]}
          onPress={() => setShowDayView(false)}
        >
          <Text style={[styles.toggleText, !showDayView && styles.toggleTextActive]}>
            WEEK
          </Text>
        </TouchableOpacity>
      </View>

      {/* Forecast list */}
      <View style={styles.forecastContainer}>
        {showDayView ? (
          <FlatList
            data={getHourlyData()}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.dt.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.forecastItem}>
                <Text style={styles.forecastTime}>
                  {index === 0 ? 'NOW' : formatTime(item.dt)}
                </Text>
                <Text style={styles.forecastIcon}>
                  {getWeatherEmoji(item.weather[0].main)}
                </Text>
                <Text style={styles.forecastTemp}>
                  {Math.round(item.main.temp)}°
                </Text>
              </View>
            )}
          />
        ) : (
          <FlatList
            data={getDailyData()}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.dt.toString()}
            renderItem={({ item }) => (
              <View style={styles.forecastItem}>
                <Text style={styles.forecastTime}>
                  {formatDay(item.dt)}
                </Text>
                <Text style={styles.forecastIcon}>
                  {getWeatherEmoji(item.weather[0].main)}
                </Text>
                <Text style={styles.forecastTempRange}>
                  {Math.round(item.main.temp_max)}° / {Math.round(item.main.temp_min)}°
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.7,
  },
  cityInputContainer: {
    width: width - 40,
    marginBottom: 10,
    zIndex: 10,
  },
  cityInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    padding: 15,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  errorInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    width: width - 60,
    marginTop: 20,
  },
  cityName: {
    fontSize: 36,
    fontWeight: '300',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 30,
    letterSpacing: 4,
  },
  mainCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 20,
  },
  weatherCondition: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  mainTemp: {
    fontSize: 72,
    fontWeight: '200',
    color: '#FFFFFF',
  },
  tempRange: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 10,
  },
  motivationalText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginVertical: 20,
    fontStyle: 'italic',
    opacity: 0.9,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 4,
    marginBottom: 30,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  toggleText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  forecastContainer: {
    width: width,
    paddingHorizontal: 20,
  },
  forecastItem: {
    alignItems: 'center',
    marginRight: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 15,
    borderRadius: 20,
    minWidth: 80,
  },
  forecastTime: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 10,
    fontWeight: '600',
  },
  forecastIcon: {
    fontSize: 42,
    marginVertical: 12,
  },
  forecastTemp: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  forecastTempRange: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    padding: 20,
  },
});