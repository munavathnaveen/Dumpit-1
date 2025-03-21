import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Text, Button, TextInput, useTheme } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useCart } from '../../context/CartContext';
import api from '../../api/config';

type RootStackParamList = {
  ProductDetail: { productId: string };
};

type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

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
  stock: number;
}

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const theme = useTheme();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState('1');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [route.params.productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await api.get(`/products/${route.params.productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      await addToCart(product.id, parseInt(quantity, 10));
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          {product.name}
        </Text>
        <Text variant="titleLarge" style={styles.price}>
          ${product.price.toFixed(2)}
        </Text>
        <Text variant="bodyLarge" style={styles.description}>
          {product.description}
        </Text>
        <Text variant="bodyMedium" style={styles.vendor}>
          Sold by: {product.vendor.name}
        </Text>
        <Text variant="bodyMedium" style={styles.stock}>
          Stock: {product.stock}
        </Text>

        <View style={styles.quantityContainer}>
          <TextInput
            label="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            mode="outlined"
            style={styles.quantityInput}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleAddToCart}
          loading={addingToCart}
          disabled={addingToCart || product.stock === 0}
          style={styles.addToCartButton}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </View>
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  price: {
    color: '#007AFF',
    marginBottom: 16,
  },
  description: {
    marginBottom: 16,
    lineHeight: 24,
  },
  vendor: {
    color: '#666',
    marginBottom: 8,
  },
  stock: {
    color: '#666',
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityInput: {
    flex: 1,
  },
  addToCartButton: {
    marginTop: 8,
  },
});

export default ProductDetailScreen; 