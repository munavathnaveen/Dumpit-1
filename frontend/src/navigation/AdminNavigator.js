import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING } from '../constants/config';

// Import screens (we'll create these next)
import AdminDashboardScreen from '../screens/admin/DashboardScreen';
import AdminUsersScreen from '../screens/admin/UsersScreen';
import AdminVendorsScreen from '../screens/admin/VendorsScreen';
import AdminProductsScreen from '../screens/admin/ProductsScreen';
import AdminOrdersScreen from '../screens/admin/OrdersScreen';
import AdminSettingsScreen from '../screens/admin/SettingsScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const AdminDrawer = () => {
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
        component={AdminDashboardScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Users"
        component={AdminUsersScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Vendors"
        component={AdminVendorsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="store" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Products"
        component={AdminProductsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="package-variant" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Orders"
        component={AdminOrdersScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shopping" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={AdminSettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const AdminNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <Stack.Screen name="AdminDrawer" component={AdminDrawer} />
      {/* Add other admin screens here */}
    </Stack.Navigator>
  );
};

export default AdminNavigator; 