import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Searchbar, Card, Text, Chip, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../../api/config';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  vendor: {
    id: string;
    name: string;
  };
}

type RootStackParamList = {
  ProductDetail: { productId: string };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(response.data.map((product: Product) => product.category))
      ) as string[];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    try {
      const response = await api.get(`/search?q=${query}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category);
    try {
      const response = await api.get(`/products?category=${category}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Category filter failed:', error);
    }
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />
      <Card.Content>
        <Text variant="titleMedium">{item.name}</Text>
        <Text variant="bodyMedium" style={styles.description}>
          {item.description}
        </Text>
        <Text variant="titleLarge" style={styles.price}>
          ${item.price.toFixed(2)}
        </Text>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search products..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Chip
            selected={selectedCategory === item}
            onPress={() => handleCategoryFilter(item)}
            style={styles.chip}
          >
            {item}
          </Chip>
        )}
        style={styles.categoryList}
      />

      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    margin: 16,
  },
  categoryList: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  productList: {
    padding: 8,
  },
  card: {
    flex: 1,
    margin: 8,
    maxWidth: '47%',
  },
  cardImage: {
    height: 150,
  },
  description: {
    marginTop: 8,
    color: '#666',
  },
  price: {
    marginTop: 8,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 