import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING } from '../constants/config';

// Import screens (we'll create these next)
import VendorDashboardScreen from '../screens/vendor/DashboardScreen';
import VendorProductsScreen from '../screens/vendor/ProductsScreen';
import VendorOrdersScreen from '../screens/vendor/OrdersScreen';
import VendorProfileScreen from '../screens/vendor/ProfileScreen';
import VendorSettingsScreen from '../screens/vendor/SettingsScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const VendorDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        drawerStyle: {
          backgroundColor: COLORS.white,
          width: SIZES.width * 0.8,
        },
        drawerLabelStyle: {
          fontSize: SIZES.font,
          fontWeight: '500',
          marginLeft: -SPACING.lg,
        },
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.gray,
        drawerItemStyle: {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.lg,
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={VendorDashboardScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Products"
        component={VendorProductsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="package-variant" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Orders"
        component={VendorOrdersScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shopping" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={VendorProfileScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={VendorSettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const VendorNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <Stack.Screen name="VendorDrawer" component={VendorDrawer} />
      {/* Add other vendor screens here */}
    </Stack.Navigator>
  );
};

export default VendorNavigator; 