import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Text, Surface, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../../components/common/Header';
import ProductCard from '../../components/common/ProductCard';
import { COLORS, SIZES, SHADOWS, SPACING } from '../../constants/config';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [nearbyVendors, setNearbyVendors] = useState([]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, vendorsRes] = await Promise.all([
        axios.get(`${API_URL}/products/featured`),
        axios.get(`${API_URL}/categories`),
        axios.get(`${API_URL}/vendors/nearby`),
      ]);

      setFeaturedProducts(productsRes.data.data);
      setCategories(categoriesRes.data.data);
      setNearbyVendors(vendorsRes.data.data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch data. Please try again.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSearch = (query) => {
    navigation.navigate('Products', { searchQuery: query });
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { productId: product._id });
  };

  const handleAddToCart = async (product) => {
    try {
      await axios.post(`${API_URL}/cart/add`, {
        productId: product._id,
        quantity: 1,
      });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Product added to cart',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add product to cart',
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      await axios.post(`${API_URL}/user/wishlist/add`, {
        productId: product._id,
      });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Product added to wishlist',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add product to wishlist',
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Dumpit"
        showSearch
        onSearch={handleSearch}
        showCart
        cartCount={0}
        onCartPress={() => navigation.navigate('Cart')}
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category._id}
                style={styles.categoryCard}
                onPress={() => navigation.navigate('Products', { category: category._id })}
              >
                <MaterialCommunityIcons
                  name={category.icon || 'tag'}
                  size={32}
                  color={COLORS.primary}
                />
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <View style={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onPress={() => handleProductPress(product)}
                onAddToCart={() => handleAddToCart(product)}
                onAddToWishlist={() => handleAddToWishlist(product)}
              />
            ))}
          </View>
        </View>

        {/* Nearby Vendors Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Vendors</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vendorsContainer}
          >
            {nearbyVendors.map((vendor) => (
              <TouchableOpacity
                key={vendor._id}
                style={styles.vendorCard}
                onPress={() => navigation.navigate('VendorProfile', { vendorId: vendor._id })}
              >
                <Image
                  source={{ uri: vendor.avatar || 'https://via.placeholder.com/100' }}
                  style={styles.vendorImage}
                />
                <Text style={styles.vendorName}>{vendor.name}</Text>
                <Text style={styles.vendorDistance}>{vendor.distance}km away</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING.md,
  },
  categoriesContainer: {
    paddingRight: SPACING.lg,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: SPACING.lg,
    width: 80,
  },
  categoryName: {
    fontSize: SIZES.small,
    color: COLORS.dark,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vendorsContainer: {
    paddingRight: SPACING.lg,
  },
  vendorCard: {
    width: width * 0.4,
    marginRight: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SPACING.sm,
    ...SHADOWS.light,
  },
  vendorImage: {
    width: '100%',
    height: 100,
    borderRadius: SIZES.base,
    marginBottom: SPACING.xs,
  },
  vendorName: {
    fontSize: SIZES.font,
    fontWeight: '500',
    color: COLORS.dark,
    marginBottom: SPACING.xs / 2,
  },
  vendorDistance: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
});

export default HomeScreen; 