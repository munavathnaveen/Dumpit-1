import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  useTheme,
  Divider,
  IconButton,
} from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../../api/config';

type RootStackParamList = {
  OrderDetail: { orderId: string };
  Home: undefined;
};

type OrderDetailScreenRouteProp = RouteProp<RootStackParamList, 'OrderDetail'>;
type OrderDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderStatus {
  status: string;
  timestamp: string;
  location?: string;
  description?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  statusHistory: OrderStatus[];
  paymentMethod: string;
  paymentStatus: string;
}

const OrderDetailScreen = () => {
  const route = useRoute<OrderDetailScreenRouteProp>();
  const navigation = useNavigation<OrderDetailScreenNavigationProp>();
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#ff9500';
      case 'processing':
        return '#007AFF';
      case 'shipped':
        return '#5856D6';
      case 'delivered':
        return '#34C759';
      case 'cancelled':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const renderStatusTimeline = () => {
    if (!order?.statusHistory) return null;

    return (
      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Order Status
          </Text>
          {order.statusHistory.map((status, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text variant="titleSmall" style={{ color: getStatusColor(status.status) }}>
                  {status.status}
                </Text>
                <Text variant="bodySmall" style={styles.timestamp}>
                  {new Date(status.timestamp).toLocaleString()}
                </Text>
                {status.location && (
                  <Text variant="bodySmall">{status.location}</Text>
                )}
                {status.description && (
                  <Text variant="bodySmall">{status.description}</Text>
                )}
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
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
      <Card style={styles.section}>
        <Card.Content>
          <View style={styles.orderHeader}>
            <Text variant="titleMedium">Order #{order.orderNumber}</Text>
            <Text
              variant="titleSmall"
              style={{ color: getStatusColor(order.status) }}
            >
              {order.status}
            </Text>
          </View>
          <Text variant="bodyMedium" style={styles.date}>
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </Card.Content>
      </Card>

      {renderStatusTimeline()}

      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Order Items
          </Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text variant="titleSmall">{item.name}</Text>
                <Text variant="bodyMedium">
                  {item.quantity}x ${item.price.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
          <Divider style={styles.divider} />
          <View style={styles.totalContainer}>
            <Text variant="titleMedium">Total Amount</Text>
            <Text variant="titleMedium" style={styles.totalAmount}>
              ${order.total.toFixed(2)}
            </Text>
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
            Payment Information
          </Text>
          <View style={styles.paymentInfo}>
            <Text>Payment Method: {order.paymentMethod}</Text>
            <Text>Payment Status: {order.paymentStatus}</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
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
  section: {
    margin: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    color: '#666',
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  divider: {
    marginVertical: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    marginRight: 12,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timestamp: {
    color: '#666',
    marginTop: 4,
  },
  paymentInfo: {
    gap: 8,
  },
}); 