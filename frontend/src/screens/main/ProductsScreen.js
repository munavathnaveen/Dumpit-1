import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Text, Surface, Button, Portal, Modal, Chip, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../../components/common/Header';
import ProductCard from '../../components/common/ProductCard';
import { COLORS, SIZES, SHADOWS, SPACING } from '../../constants/config';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const ProductsScreen = ({ route, navigation }) => {
  const { searchQuery, category } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const priceRanges = [
    { label: 'Under ₹100', value: { min: 0, max: 100 } },
    { label: '₹100 - ₹500', value: { min: 100, max: 500 } },
    { label: '₹500 - ₹1000', value: { min: 500, max: 1000 } },
    { label: 'Over ₹1000', value: { min: 1000, max: null } },
  ];

  const ratings = [
    { label: '4+ Stars', value: 4 },
    { label: '3+ Stars', value: 3 },
    { label: '2+ Stars', value: 2 },
    { label: '1+ Star', value: 1 },
  ];

  const sortOptions = [
    { label: 'Popular', value: 'popular' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Newest', value: 'newest' },
    { label: 'Highest Rated', value: 'rating' },
  ];

  const fetchProducts = async (pageNum = 1, refresh = false) => {
    try {
      const params = {
        page: pageNum,
        limit: 10,
        category: selectedCategory,
        minPrice: selectedPriceRange?.min,
        maxPrice: selectedPriceRange?.max,
        rating: selectedRating,
        sort: sortBy,
        search: searchQuery,
      };

      const response = await axios.get(`${API_URL}/products`, { params });
      const { data, pagination } = response.data;

      setProducts(prev => refresh ? data : [...prev, ...data]);
      setHasMore(pageNum < pagination.pages);
      setPage(pageNum);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch products. Please try again.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, true);
  }, [selectedCategory, selectedPriceRange, selectedRating, sortBy, searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts(1, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchProducts(page + 1);
    }
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

  const FilterModal = () => (
    <Portal>
      <Modal
        visible={showFilters}
        onDismiss={() => setShowFilters(false)}
        contentContainerStyle={styles.modal}
      >
        <Text style={styles.modalTitle}>Filters</Text>

        <Text style={styles.filterTitle}>Categories</Text>
        <View style={styles.chipContainer}>
          {categories.map((cat) => (
            <Chip
              key={cat._id}
              selected={selectedCategory === cat._id}
              onPress={() => setSelectedCategory(cat._id)}
              style={styles.chip}
            >
              {cat.name}
            </Chip>
          ))}
        </View>

        <Text style={styles.filterTitle}>Price Range</Text>
        <View style={styles.chipContainer}>
          {priceRanges.map((range) => (
            <Chip
              key={range.label}
              selected={selectedPriceRange?.min === range.value.min}
              onPress={() => setSelectedPriceRange(range.value)}
              style={styles.chip}
            >
              {range.label}
            </Chip>
          ))}
        </View>

        <Text style={styles.filterTitle}>Rating</Text>
        <View style={styles.chipContainer}>
          {ratings.map((rating) => (
            <Chip
              key={rating.label}
              selected={selectedRating === rating.value}
              onPress={() => setSelectedRating(rating.value)}
              style={styles.chip}
            >
              {rating.label}
            </Chip>
          ))}
        </View>

        <Text style={styles.filterTitle}>Sort By</Text>
        <View style={styles.chipContainer}>
          {sortOptions.map((option) => (
            <Chip
              key={option.value}
              selected={sortBy === option.value}
              onPress={() => setSortBy(option.value)}
              style={styles.chip}
            >
              {option.label}
            </Chip>
          ))}
        </View>

        <Button
          mode="contained"
          onPress={() => setShowFilters(false)}
          style={styles.applyButton}
        >
          Apply Filters
        </Button>
      </Modal>
    </Portal>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Products"
        showSearch
        onSearch={(query) => navigation.setParams({ searchQuery: query })}
        showCart
        cartCount={0}
        onCartPress={() => navigation.navigate('Cart')}
        rightIcon="filter-variant"
        onRightPress={() => setShowFilters(true)}
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;
          const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;

          if (isCloseToBottom) {
            loadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        <View style={styles.productsGrid}>
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onPress={() => handleProductPress(product)}
              onAddToCart={() => handleAddToCart(product)}
              onAddToWishlist={() => handleAddToWishlist(product)}
            />
          ))}
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
      </ScrollView>

      <FilterModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  loadingContainer: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  modal: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    margin: SPACING.lg,
    borderRadius: SIZES.base,
  },
  modalTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING.lg,
  },
  filterTitle: {
    fontSize: SIZES.font,
    fontWeight: '500',
    color: COLORS.dark,
    marginBottom: SPACING.sm,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.lg,
  },
  chip: {
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  applyButton: {
    marginTop: SPACING.md,
  },
});

export default ProductsScreen; 