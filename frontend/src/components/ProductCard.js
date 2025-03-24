import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Title, Paragraph, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS, SPACING } from '../constants/config';

const ProductCard = ({ product, onPress, style }) => {
  const discountedPrice = product.discount?.percentage
    ? product.price * (1 - product.discount.percentage / 100)
    : product.price;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Card style={styles.card}>
        <Card.Cover
          source={{ uri: product.images[0] }}
          style={styles.image}
        />
        <Card.Content style={styles.content}>
          <Title style={styles.title} numberOfLines={2}>
            {product.name}
          </Title>
          <Paragraph style={styles.description} numberOfLines={2}>
            {product.description}
          </Paragraph>
          <View style={styles.priceContainer}>
            {product.discount?.percentage > 0 && (
              <Text style={styles.originalPrice}>₹{product.price}</Text>
            )}
            <Text style={styles.price}>₹{discountedPrice}</Text>
            {product.discount?.percentage > 0 && (
              <Text style={styles.discount}>
                {product.discount.percentage}% OFF
              </Text>
            )}
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
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    ...SHADOWS.light,
  },
  image: {
    height: 150,
  },
  content: {
    padding: SPACING.sm,
  },
  title: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  originalPrice: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    textDecorationLine: 'line-through',
    marginRight: SPACING.xs,
  },
  price: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  discount: {
    fontSize: SIZES.small,
    color: COLORS.success,
    marginLeft: SPACING.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: SIZES.small,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
  reviews: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginLeft: SPACING.xs,
  },
});

export default ProductCard; 