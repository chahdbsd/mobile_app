import { View, Text, FlatList, ActivityIndicator, Image, StyleSheet, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};


export default function ExplorerScreen() {
  const [data, setData] = useState<Meal[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false); // pagination
  const [initialLoading, setInitialLoading] = useState(true); // premier chargement

const fetchData = async () => {
  if (loading) return;

  setLoading(true);

  try {
    const response = await fetch(
      'https://www.themealdb.com/api/json/v1/1/search.php?f=c'
    );
    const json = await response.json();

    if (json.meals) {
      setData(json.meals);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
    setInitialLoading(false);
  }
};


  useEffect(() => {
    fetchData();
  }, []);

  // Loader central au premier chargement
  if (initialLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.idMeal}
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() =>
            router.push({
              pathname: '/explorer/[id]',
              params: { id: item.idMeal },
            })
          }
  >
    <Image source={{ uri: item.strMealThumb }} style={styles.image} />
    <View style={styles.textContainer}>
      <Text style={styles.name}>{item.strMeal}</Text>
    </View>
  </Pressable>
)}


      onEndReached={fetchData}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading ? <ActivityIndicator style={{ margin: 20 }} /> : null
      }
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e', // même couleur que Météo
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

