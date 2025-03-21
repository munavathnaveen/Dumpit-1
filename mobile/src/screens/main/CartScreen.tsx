import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  Text,
  Button,
  IconButton,
  useTheme,
  Divider,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart } from '../../context/CartContext';

type RootStackParamList = {
  Home: undefined;
  Checkout: undefined;
};

type CartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CartScreen = () => {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const theme = useTheme();
  const {
    items,
    isLoading,
    removeFromCart,
    updateQuantity,
    getTotal,
    clearCart,
  } = useCart();

  const handleQuantityChange = (productId: string, currentQuantity: number, increment: boolean) => {
    const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text variant="titleMedium">{item.name}</Text>
        <Text variant="bodyMedium" style={styles.itemPrice}>
          ${item.price.toFixed(2)}
        </Text>
      </View>
      <View style={styles.quantityContainer}>
        <IconButton
          icon="minus"
          size={20}
          onPress={() => handleQuantityChange(item.productId, item.quantity, false)}
        />
        <Text variant="bodyLarge">{item.quantity}</Text>
        <IconButton
          icon="plus"
          size={20}
          onPress={() => handleQuantityChange(item.productId, item.quantity, true)}
        />
      </View>
      <IconButton
        icon="delete"
        size={20}
        onPress={() => removeFromCart(item.productId)}
      />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall">Your cart is empty</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Home')}
          style={styles.shopButton}
        >
          Start Shopping
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider />}
      />
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text variant="titleLarge">Total:</Text>
          <Text variant="titleLarge" style={styles.totalAmount}>
            ${getTotal().toFixed(2)}
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Checkout')}
          style={styles.checkoutButton}
        >
          Proceed to Checkout
        </Button>
        <Button
          mode="outlined"
          onPress={clearCart}
          style={styles.clearButton}
        >
          Clear Cart
        </Button>
      </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  shopButton: {
    marginTop: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemPrice: {
    color: '#007AFF',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalAmount: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  checkoutButton: {
    marginBottom: 8,
  },
  clearButton: {
    borderColor: '#ff3b30',
  },
});

export default CartScreen; 