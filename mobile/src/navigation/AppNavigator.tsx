import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import { IconButton } from 'react-native-paper';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import ProductDetailScreen from '../screens/main/ProductDetailScreen';
import CartScreen from '../screens/main/CartScreen';
import OrdersScreen from '../screens/main/OrdersScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import CheckoutScreen from '../screens/main/CheckoutScreen';
import OrderConfirmationScreen from '../screens/main/OrderConfirmationScreen';
import OrderDetailScreen from '../screens/main/OrderDetailScreen';
import VendorScreen from '../screens/main/VendorScreen';
import ReviewScreen from '../screens/main/ReviewScreen';
import AnalyticsScreen from '../screens/main/AnalyticsScreen';

// Vendor Screens
import VendorDashboardScreen from '../screens/vendor/DashboardScreen';
import VendorProductsScreen from '../screens/vendor/ProductsScreen';
import VendorOrdersScreen from '../screens/vendor/OrdersScreen';
import VendorAnalyticsScreen from '../screens/vendor/AnalyticsScreen';
import VendorSettingsScreen from '../screens/vendor/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Orders':
              iconName = 'package-variant';
              break;
            case 'Cart':
              iconName = 'cart';
              break;
            case 'Notifications':
              iconName = 'bell';
              break;
            case 'Profile':
              iconName = 'account';
              break;
            default:
              iconName = 'circle';
          }

          return <IconButton icon={iconName} size={size} iconColor={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const VendorTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'view-dashboard';
              break;
            case 'Products':
              iconName = 'package-variant';
              break;
            case 'Orders':
              iconName = 'shopping';
              break;
            case 'Analytics':
              iconName = 'chart-bar';
              break;
            case 'Settings':
              iconName = 'cog';
              break;
            default:
              iconName = 'circle';
          }

          return <IconButton icon={iconName} size={size} iconColor={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={VendorDashboardScreen} />
      <Tab.Screen name="Products" component={VendorProductsScreen} />
      <Tab.Screen name="Orders" component={VendorOrdersScreen} />
      <Tab.Screen name="Analytics" component={VendorAnalyticsScreen} />
      <Tab.Screen name="Settings" component={VendorSettingsScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, isVendor } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!user ? (
          // Auth Stack
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : isVendor ? (
          // Vendor Stack
          <>
            <Stack.Screen
              name="VendorMain"
              component={VendorTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
            <Stack.Screen name="Analytics" component={AnalyticsScreen} />
          </>
        ) : (
          // User Stack
          <>
            <Stack.Screen
              name="Main"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="Vendor" component={VendorScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen
              name="OrderConfirmation"
              component={OrderConfirmationScreen}
            />
            <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
            <Stack.Screen name="Review" component={ReviewScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 