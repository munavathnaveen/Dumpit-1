import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  useTheme,
  Button,
  IconButton,
  List,
  Divider,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../../api/config';

type RootStackParamList = {
  VendorMain: undefined;
  ProductDetail: { productId: string };
  OrderDetail: { orderId: string };
  Analytics: undefined;
  Orders: undefined;
  Products: undefined;
};

type VendorDashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface DashboardData {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  recentProducts: Array<{
    id: string;
    name: string;
    stock: number;
    sales: number;
  }>;
}

const VendorDashboardScreen = () => {
  const navigation = useNavigation<VendorDashboardScreenNavigationProp>();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vendor/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!dashboardData) {
    return (
      <View style={styles.errorContainer}>
        <Text>Failed to load dashboard data</Text>
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
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="titleMedium">Total Sales</Text>
            <Text variant="headlineMedium">
              ${dashboardData.totalSales.toFixed(2)}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="titleMedium">Total Orders</Text>
            <Text variant="headlineMedium">{dashboardData.totalOrders}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="titleMedium">Pending Orders</Text>
            <Text variant="headlineMedium">{dashboardData.pendingOrders}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="titleMedium">Low Stock Items</Text>
            <Text variant="headlineMedium">{dashboardData.lowStockProducts}</Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.section}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium">Recent Orders</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Orders')}
              compact
            >
              View All
            </Button>
          </View>
          {dashboardData.recentOrders.map((order) => (
            <List.Item
              key={order.id}
              title={`Order #${order.orderNumber}`}
              description={`${order.customerName} • ${new Date(
                order.createdAt
              ).toLocaleDateString()}`}
              right={() => (
                <View style={styles.orderRight}>
                  <Text
                    variant="bodyMedium"
                    style={{ color: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </Text>
                  <Text variant="bodyMedium">${order.total.toFixed(2)}</Text>
                </View>
              )}
              onPress={() =>
                navigation.navigate('OrderDetail', { orderId: order.id })
              }
            />
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium">Recent Products</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Products')}
              compact
            >
              View All
            </Button>
          </View>
          {dashboardData.recentProducts.map((product) => (
            <List.Item
              key={product.id}
              title={product.name}
              description={`Stock: ${product.stock} • Sales: ${product.sales}`}
              right={() => (
                <IconButton
                  icon="chevron-right"
                  size={20}
                  onPress={() =>
                    navigation.navigate('ProductDetail', {
                      productId: product.id,
                    })
                  }
                />
              )}
            />
          ))}
        </Card.Content>
      </Card>

      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Products')}
          style={styles.actionButton}
          icon="package-variant-plus"
        >
          Add Product
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Analytics')}
          style={styles.actionButton}
          icon="chart-bar"
        >
          View Analytics
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    margin: 8,
  },
  section: {
    margin: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  actionButtons: {
    padding: 16,
    gap: 8,
  },
  actionButton: {
    marginBottom: 8,
  },
});

export default VendorDashboardScreen; 