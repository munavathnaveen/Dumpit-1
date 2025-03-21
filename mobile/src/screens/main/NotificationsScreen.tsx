import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Text, List, IconButton, useTheme, Divider } from 'react-native-paper';
import api from '../../api/config';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  data?: {
    orderId?: string;
    productId?: string;
  };
}

const NotificationsScreen = () => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'order':
        return 'package-variant';
      case 'product':
        return 'shopping';
      case 'promotion':
        return 'tag';
      default:
        return 'bell';
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <List.Item
      title={item.title}
      description={item.message}
      left={(props) => (
        <List.Icon
          {...props}
          icon={getNotificationIcon(item.type)}
          color={item.read ? '#8E8E93' : theme.colors.primary}
        />
      )}
      right={(props) => (
        <View style={styles.notificationActions}>
          {!item.read && (
            <IconButton
              {...props}
              icon="check"
              size={20}
              onPress={() => handleMarkAsRead(item.id)}
            />
          )}
          <IconButton
            {...props}
            icon="delete"
            size={20}
            onPress={() => handleDeleteNotification(item.id)}
          />
        </View>
      )}
      style={[
        styles.notificationItem,
        !item.read && styles.unreadNotification,
      ]}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall">No notifications</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      renderItem={renderNotification}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <Divider />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
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
  notificationItem: {
    backgroundColor: '#fff',
  },
  unreadNotification: {
    backgroundColor: '#F2F2F7',
  },
  notificationActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 