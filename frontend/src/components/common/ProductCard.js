import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Text, IconButton, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS, SPACING } from '../../constants/config';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 3) / 2;

const ProductCard = ({
  product,
  onPress,
  onAddToCart,
  onAddToWishlist,
  isWishlisted = false,
  showDiscount = true,
}) => {
  const discountedPrice = product.discount?.percentage
    ? product.price * (1 - product.discount.percentage / 100)
    : product.price;

  return (
    <TouchableOpacity onPress={onPress}>
      <Surface style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />
          {product.discount?.percentage && showDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {product.discount.percentage}% OFF
              </Text>
            </View>
          )}
          <IconButton
            icon={isWishlisted ? 'heart' : 'heart-outline'}
            size={24}
            iconColor={isWishlisted ? COLORS.danger : COLORS.gray}
            onPress={onAddToWishlist}
            style={styles.wishlistButton}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.vendor} numberOfLines={1}>
            {product.vendor?.name}
          </Text>

          <View style={styles.priceContainer}>
            <View style={styles.priceWrapper}>
              <Text style={styles.price}>₹{discountedPrice.toFixed(2)}</Text>
              {product.discount?.percentage && showDiscount && (
                <Text style={styles.originalPrice}>₹{product.price.toFixed(2)}</Text>
              )}
            </View>
            <IconButton
              icon="cart-plus"
              size={20}
              iconColor={COLORS.primary}
              onPress={onAddToCart}
              style={styles.cartButton}
            />
          </View>

          <View style={styles.ratingContainer}>
            <MaterialCommunityIcons
              name="star"
              size={16}
              color={COLORS.warning}
            />
            <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>({product.numReviews})</Text>
          </View>
        </View>
      </Surface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginBottom: SPACING.lg,
    borderRadius: SIZES.base,
    overflow: 'hidden',
    ...SHADOWS.light,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: CARD_WIDTH,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: SPACING.xs,
    left: SPACING.xs,
    backgroundColor: COLORS.danger,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs / 2,
    borderRadius: SIZES.base,
  },
  discountText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: 'bold',
  },
  wishlistButton: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base * 2,
    margin: 0,
  },
  content: {
    padding: SPACING.sm,
  },
  name: {
    fontSize: SIZES.font,
    fontWeight: '500',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  vendor: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  originalPrice: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    textDecorationLine: 'line-through',
    marginLeft: SPACING.xs,
  },
  cartButton: {
    margin: 0,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: SIZES.small,
    fontWeight: '500',
    color: COLORS.dark,
    marginLeft: SPACING.xs / 2,
  },
  reviews: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginLeft: SPACING.xs / 2,
  },
});

export default ProductCard; 