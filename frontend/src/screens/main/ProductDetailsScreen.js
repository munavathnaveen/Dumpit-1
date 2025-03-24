import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
} from 'react-native';
import { Text, Surface, Button, IconButton, Portal, Modal, TextInput, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../../components/common/Header';
import { COLORS, SIZES, SHADOWS, SPACING } from '../../constants/config';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window');

const ProductDetailsScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [loadingReview, setLoadingReview] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}`);
      setProduct(response.data.data);
      setLoading(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch product details',
      });
      navigation.goBack();
    }
  };

  const handleAddToCart = async () => {
    try {
      await axios.post(`${API_URL}/cart/add`, {
        productId,
        quantity,
      });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Product added to cart',
      });
      navigation.navigate('Cart');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add product to cart',
      });
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await axios.post(`${API_URL}/user/wishlist/add`, {
        productId,
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

  const handleShare = async () => {
    try {
      await Linking.share({
        message: `Check out ${product.name} on Dumpit!`,
        url: `https://dumpit.com/product/${productId}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      setLoadingReview(true);
      await axios.post(`${API_URL}/products/${productId}/reviews`, review);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Review submitted successfully',
      });
      setShowReviewModal(false);
      fetchProductDetails();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to submit review',
      });
    } finally {
      setLoadingReview(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const discountedPrice = product.discount?.percentage
    ? product.price * (1 - product.discount.percentage / 100)
    : product.price;

  return (
    <View style={styles.container}>
      <Header
        title="Product Details"
        onBack={() => navigation.goBack()}
        rightIcon="share-variant"
        onRightPress={handleShare}
      />

      <ScrollView>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.images[selectedImage] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailContainer}
          >
            {product.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImage(index)}
                style={[
                  styles.thumbnail,
                  selectedImage === index && styles.selectedThumbnail,
                ]}
              >
                <Image source={{ uri: image }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Info */}
        <Surface style={styles.infoContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.vendor}>Sold by {product.vendor.name}</Text>

          <View style={styles.priceContainer}>
            <View>
              <Text style={styles.price}>₹{discountedPrice.toFixed(2)}</Text>
              {product.discount?.percentage && (
                <Text style={styles.originalPrice}>
                  ₹{product.price.toFixed(2)}
                </Text>
              )}
            </View>
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons
                name="star"
                size={20}
                color={COLORS.warning}
              />
              <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
              <Text style={styles.reviews}>({product.numReviews})</Text>
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantityControls}>
              <IconButton
                icon="minus"
                size={20}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              />
              <Text style={styles.quantity}>{quantity}</Text>
              <IconButton
                icon="plus"
                size={20}
                onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
              />
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Specifications */}
          <Text style={styles.sectionTitle}>Specifications</Text>
          {Object.entries(product.specifications).map(([key, value]) => (
            <View key={key} style={styles.specification}>
              <Text style={styles.specKey}>{key}</Text>
              <Text style={styles.specValue}>{value}</Text>
            </View>
          ))}

          {/* Reviews */}
          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <Button
                mode="text"
                onPress={() => setShowReviewModal(true)}
                disabled={!user}
              >
                Write a Review
              </Button>
            </View>

            {product.reviews.map((review, index) => (
              <View key={index} style={styles.review}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>{review.user.name}</Text>
                  <View style={styles.reviewRating}>
                    <MaterialCommunityIcons
                      name="star"
                      size={16}
                      color={COLORS.warning}
                    />
                    <Text style={styles.reviewRatingText}>
                      {review.rating}
                    </Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <Text style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>

          {/* Vendor Location */}
          <Text style={styles.sectionTitle}>Vendor Location</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: product.vendor.location.coordinates[1],
                longitude: product.vendor.location.coordinates[0],
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: product.vendor.location.coordinates[1],
                  longitude: product.vendor.location.coordinates[0],
                }}
                title={product.vendor.name}
              />
            </MapView>
          </View>
        </Surface>
      </ScrollView>

      {/* Action Buttons */}
      <Surface style={styles.actionContainer}>
        <IconButton
          icon="heart-outline"
          size={24}
          onPress={handleAddToWishlist}
          style={styles.actionButton}
        />
        <Button
          mode="contained"
          onPress={handleAddToCart}
          style={styles.addToCartButton}
        >
          Add to Cart
        </Button>
      </Surface>

      {/* Review Modal */}
      <Portal>
        <Modal
          visible={showReviewModal}
          onDismiss={() => setShowReviewModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Write a Review</Text>
          <View style={styles.ratingInput}>
            {[1, 2, 3, 4, 5].map((star) => (
              <IconButton
                key={star}
                icon={star <= review.rating ? 'star' : 'star-outline'}
                size={32}
                iconColor={COLORS.warning}
                onPress={() => setReview({ ...review, rating: star })}
              />
            ))}
          </View>
          <TextInput
            label="Your Review"
            value={review.comment}
            onChangeText={(text) => setReview({ ...review, comment: text })}
            multiline
            numberOfLines={4}
            style={styles.reviewInput}
          />
          <Button
            mode="contained"
            onPress={handleReviewSubmit}
            loading={loadingReview}
            disabled={loadingReview || !review.comment.trim()}
            style={styles.submitButton}
          >
            Submit Review
          </Button>
        </Modal>
      </Portal>
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
  imageContainer: {
    height: width,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailContainer: {
    position: 'absolute',
    bottom: SPACING.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: SPACING.sm,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: SIZES.base,
    marginRight: SPACING.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: COLORS.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: SIZES.base,
  },
  infoContainer: {
    padding: SPACING.lg,
    marginTop: -SPACING.xl,
    borderTopLeftRadius: SIZES.base * 2,
    borderTopRightRadius: SIZES.base * 2,
    ...SHADOWS.medium,
  },
  name: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  vendor: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginBottom: SPACING.md,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  price: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  originalPrice: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    color: COLORS.dark,
    marginLeft: SPACING.xs,
  },
  reviews: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginLeft: SPACING.xs,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  quantityLabel: {
    fontSize: SIZES.font,
    color: COLORS.dark,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
    marginHorizontal: SPACING.sm,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: SIZES.font,
    color: COLORS.dark,
    lineHeight: SIZES.font * 1.5,
    marginBottom: SPACING.lg,
  },
  specification: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  specKey: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  specValue: {
    fontSize: SIZES.font,
    color: COLORS.dark,
    fontWeight: '500',
  },
  reviewsSection: {
    marginTop: SPACING.lg,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  review: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  reviewerName: {
    fontSize: SIZES.font,
    fontWeight: '500',
    color: COLORS.dark,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    fontSize: SIZES.font,
    color: COLORS.dark,
    marginLeft: SPACING.xs,
  },
  reviewComment: {
    fontSize: SIZES.font,
    color: COLORS.dark,
    lineHeight: SIZES.font * 1.5,
    marginBottom: SPACING.xs,
  },
  reviewDate: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  mapContainer: {
    height: 200,
    borderRadius: SIZES.base,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  actionContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
  },
  actionButton: {
    margin: 0,
    marginRight: SPACING.sm,
  },
  addToCartButton: {
    flex: 1,
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
  ratingInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  reviewInput: {
    marginBottom: SPACING.lg,
  },
  submitButton: {
    marginTop: SPACING.md,
  },
});

export default ProductDetailsScreen; 