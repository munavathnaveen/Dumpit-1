import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Text, Card, useTheme, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../../api/config';

type RootStackParamList = {
  OrderDetail: { orderId: string };
};

type OrdersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

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
}

const OrdersScreen = () => {
  const navigation = useNavigation<OrdersScreenNavigationProp>();
  const theme = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
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

  const renderOrderCard = ({ item }: { item: Order }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
    >
      <Card.Content>
        <View style={styles.orderHeader}>
          <Text variant="titleMedium">Order #{item.orderNumber}</Text>
          <Chip
            textStyle={{ color: '#fff' }}
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
          >
            {item.status}
          </Chip>
        </View>
        <Text variant="bodyMedium" style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <View style={styles.itemsContainer}>
          {item.items.map((orderItem) => (
            <Text key={orderItem.id} variant="bodyMedium">
              {orderItem.quantity}x {orderItem.name}
            </Text>
          ))}
        </View>
        <View style={styles.totalContainer}>
          <Text variant="titleMedium">Total:</Text>
          <Text variant="titleMedium" style={styles.totalAmount}>
            ${item.total.toFixed(2)}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall">No orders found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      renderItem={renderOrderCard}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
  card: {
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusChip: {
    borderRadius: 12,
  },
  date: {
    color: '#666',
    marginBottom: 8,
  },
  itemsContainer: {
    marginVertical: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  totalAmount: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
}); 