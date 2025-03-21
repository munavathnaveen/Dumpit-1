import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  useTheme,
  Divider,
  Chip,
  IconButton,
  Button,
} from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../../api/config';

type RootStackParamList = {
  Vendor: { vendorId: string };
  ProductDetail: { productId: string };
};

type VendorScreenRouteProp = RouteProp<RootStackParamList, 'Vendor'>;
type VendorScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Vendor {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  totalOrders: number;
  categories: string[];
  products: Product[];
  reviews: Review[];
}

const VendorScreen = () => {
  const route = useRoute<VendorScreenRouteProp>();
  const navigation = useNavigation<VendorScreenNavigationProp>();
  const theme = useTheme();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchVendorDetails();
  }, [route.params.vendorId]);

  const fetchVendorDetails = async () => {
    try {
      const response = await api.get(`/vendors/${route.params.vendorId}`);
      setVendor(response.data);
    } catch (error) {
      console.error('Failed to fetch vendor details:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchVendorDetails();
  };

  const renderRatingStars = (rating: number) => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <IconButton
            key={star}
            icon={star <= rating ? 'star' : 'star-outline'}
            size={16}
            iconColor={star <= rating ? '#FFD700' : '#ccc'}
          />
        ))}
      </View>
    );
  };

  const filteredProducts = selectedCategory
    ? vendor?.products.filter((product) => product.category === selectedCategory)
    : vendor?.products;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!vendor) {
    return (
      <View style={styles.errorContainer}>
        <Text>Vendor not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Image source={{ uri: vendor.coverImage }} style={styles.coverImage} />
      <View style={styles.header}>
        <Image source={{ uri: vendor.logo }} style={styles.logo} />
        <View style={styles.headerInfo}>
          <Text variant="headlineSmall">{vendor.name}</Text>
          <View style={styles.ratingContainer}>
            {renderRatingStars(vendor.rating)}
            <Text variant="bodyMedium">
              ({vendor.reviewCount} reviews)
            </Text>
          </View>
        </View>
      </View>

      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            About
          </Text>
          <Text variant="bodyMedium">{vendor.description}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text variant="titleLarge">{vendor.rating.toFixed(1)}</Text>
              <Text variant="bodySmall">Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="titleLarge">{vendor.reviewCount}</Text>
              <Text variant="bodySmall">Reviews</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="titleLarge">{vendor.totalOrders}</Text>
              <Text variant="bodySmall">Orders</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Categories
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {vendor.categories.map((category) => (
              <Chip
                key={category}
                selected={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
                style={styles.categoryChip}
              >
                {category}
              </Chip>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Products
          </Text>
          {filteredProducts?.map((product) => (
            <Card
              key={product.id}
              style={styles.productCard}
              onPress={() =>
                navigation.navigate('ProductDetail', { productId: product.id })
              }
            >
              <Card.Cover source={{ uri: product.image }} />
              <Card.Content>
                <Text variant="titleMedium">{product.name}</Text>
                <Text variant="bodyMedium" style={styles.price}>
                  ${product.price.toFixed(2)}
                </Text>
                <View style={styles.productRating}>
                  {renderRatingStars(product.rating)}
                  <Text variant="bodySmall">
                    ({product.reviewCount})
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Reviews
          </Text>
          {vendor.reviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text variant="titleSmall">{review.userName}</Text>
                {renderRatingStars(review.rating)}
              </View>
              <Text variant="bodyMedium" style={styles.reviewComment}>
                {review.comment}
              </Text>
              <Text variant="bodySmall" style={styles.reviewDate}>
                {new Date(review.createdAt).toLocaleDateString()}
              </Text>
              <Divider style={styles.reviewDivider} />
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: -40,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryChip: {
    marginRight: 8,
  },
  productCard: {
    marginBottom: 16,
  },
  price: {
    color: '#007AFF',
    marginTop: 8,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewComment: {
    marginTop: 8,
  },
  reviewDate: {
    color: '#666',
    marginTop: 4,
  },
  reviewDivider: {
    marginTop: 16,
  },
}); 