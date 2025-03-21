import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  useTheme,
  IconButton,
} from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../../api/config';

type RootStackParamList = {
  OrderConfirmation: { orderId: string };
  Home: undefined;
  OrderDetail: { orderId: string };
};

type OrderConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'OrderConfirmation'>;
type OrderConfirmationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
}

const OrderConfirmationScreen = () => {
  const route = useRoute<OrderConfirmationScreenRouteProp>();
  const navigation = useNavigation<OrderConfirmationScreenNavigationProp>();
  const theme = useTheme();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [route.params.orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/orders/${route.params.orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text>Order not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.successContainer}>
        <IconButton
          icon="check-circle"
          size={80}
          iconColor={theme.colors.primary}
        />
        <Text variant="headlineMedium" style={styles.successTitle}>
          Order Placed Successfully!
        </Text>
        <Text variant="bodyLarge" style={styles.orderNumber}>
          Order #{order.orderNumber}
        </Text>
      </View>

      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Order Details
          </Text>
          <View style={styles.orderItem}>
            <Text>Order Date</Text>
            <Text>{new Date(order.createdAt).toLocaleDateString()}</Text>
          </View>
          <View style={styles.orderItem}>
            <Text>Status</Text>
            <Text style={styles.statusText}>{order.status}</Text>
          </View>
          <View style={styles.orderItem}>
            <Text>Total Amount</Text>
            <Text style={styles.totalAmount}>${order.total.toFixed(2)}</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Shipping Address
          </Text>
          <Text>{order.shippingAddress.fullName}</Text>
          <Text>{order.shippingAddress.address}</Text>
          <Text>
            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
            {order.shippingAddress.zipCode}
          </Text>
          <Text>{order.shippingAddress.phone}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Order Items
          </Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text>{item.name}</Text>
              <Text>
                {item.quantity}x ${item.price.toFixed(2)}
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
          style={styles.button}
        >
          View Order Details
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Home')}
          style={styles.button}
        >
          Continue Shopping
        </Button>
      </View>
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
  successContainer: {
    alignItems: 'center',
    padding: 32,
  },
  successTitle: {
    marginTop: 16,
    textAlign: 'center',
  },
  orderNumber: {
    marginTop: 8,
    color: '#666',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  totalAmount: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    marginBottom: 8,
  },
});

export default OrderConfirmationScreen; 