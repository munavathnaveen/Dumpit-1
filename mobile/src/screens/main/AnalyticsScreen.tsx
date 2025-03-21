import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  useTheme,
  SegmentedButtons,
  DataTable,
} from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';
import api from '../../api/config';

interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  customerCount: number;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    orders: number;
  }>;
  salesByDay: Array<{
    date: string;
    amount: number;
  }>;
  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;
}

const AnalyticsScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('week');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/analytics?timeRange=${timeRange}`);
      setAnalytics(response.data);
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Failed to fetch analytics:', err);
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

  if (error || !analytics) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error || 'No analytics data available'}</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width;

  const salesChartData = {
    labels: analytics.salesByDay.map((day) => day.date),
    datasets: [
      {
        data: analytics.salesByDay.map((day) => day.amount),
      },
    ],
  };

  const ordersChartData = {
    labels: analytics.ordersByStatus.map((status) => status.status),
    datasets: [
      {
        data: analytics.ordersByStatus.map((status) => status.count),
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <SegmentedButtons
        value={timeRange}
        onValueChange={setTimeRange}
        buttons={[
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
          { value: 'year', label: 'Year' },
        ]}
        style={styles.timeRangeSelector}
      />

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="titleMedium">Total Sales</Text>
            <Text variant="headlineMedium">
              ${analytics.totalSales.toFixed(2)}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="titleMedium">Total Orders</Text>
            <Text variant="headlineMedium">{analytics.totalOrders}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="titleMedium">Avg. Order Value</Text>
            <Text variant="headlineMedium">
              ${analytics.averageOrderValue.toFixed(2)}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text variant="titleMedium">Customers</Text>
            <Text variant="headlineMedium">{analytics.customerCount}</Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.chartCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.chartTitle}>
            Sales Trend
          </Text>
          <LineChart
            data={salesChartData}
            width={screenWidth - 48}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <Card style={styles.chartCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.chartTitle}>
            Orders by Status
          </Text>
          <BarChart
            data={ordersChartData}
            width={screenWidth - 48}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      <Card style={styles.tableCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.tableTitle}>
            Top Products
          </Text>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Product</DataTable.Title>
              <DataTable.Title numeric>Sales</DataTable.Title>
              <DataTable.Title numeric>Orders</DataTable.Title>
            </DataTable.Header>

            {analytics.topProducts.map((product) => (
              <DataTable.Row key={product.id}>
                <DataTable.Cell>{product.name}</DataTable.Cell>
                <DataTable.Cell numeric>
                  ${product.sales.toFixed(2)}
                </DataTable.Cell>
                <DataTable.Cell numeric>{product.orders}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
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
  timeRangeSelector: {
    margin: 16,
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
  chartCard: {
    margin: 16,
  },
  chartTitle: {
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  tableCard: {
    margin: 16,
  },
  tableTitle: {
    marginBottom: 16,
  },
}); 