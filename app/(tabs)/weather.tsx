import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

type WeatherData = {
  temperature: number;
};

type Recipe = {
  name: string;
  image: string;
};

export default function WeatherScreen() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permission de localisation refusée');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // 🌦️ API météo
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherJson = await weatherRes.json();
      const temperature = weatherJson.current_weather.temperature;

      setWeather({ temperature });

      // 🍽️ Logique recette
      const mealType = temperature < 12 ? 'Soup' : 'Salad';

      const recipeRes = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealType}`
      );
      const recipeJson = await recipeRes.json();

      if (recipeJson.meals && recipeJson.meals.length > 0) {
        setRecipe({
          name: recipeJson.meals[0].strMeal,
          image: recipeJson.meals[0].strMealThumb,
        });
      }

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>{errorMsg}</Text>
      </View>
    );
  }

  return (
  <View style={styles.container}>
    {/* Card météo */}
    <View style={styles.card}>
      <Text style={styles.label}>Température actuelle</Text>
      <Text style={styles.temp}>
        {weather?.temperature}°C
      </Text>
    </View>

    {/* Card recette */}
    {recipe && (
      <View style={styles.card}>
        <Text style={styles.label}>Recette recommandée</Text>
        <Text style={styles.recipeName}>{recipe.name}</Text>
        <Image source={{ uri: recipe.image }} style={styles.image} />
      </View>
    )}
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 8,
  },
  temp: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  recipeName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  image: {
    width: 240,
    height: 240,
    borderRadius: 14,
  },
  text: {
  color: 'white',
  fontSize: 16,
  textAlign: 'center',
},

});

