import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../constants/config';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Initialize auth state from storage
  initialize: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      
      if (token && userData) {
        set({
          user: JSON.parse(userData),
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Login
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const { token, user } = response.data;
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        isAuthenticated: true,
        isLoading: false
      });

      return user;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false
      });
      throw error;
    }
  },

  // Register
  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/auth/register`, userData);

      const { token, user } = response.data;
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        isAuthenticated: true,
        isLoading: false
      });

      return user;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false
      });
      throw error;
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    try {
      set({ isLoading: true, error: null });
      await axios.post(`${API_URL}/auth/forgot-password`, { email });
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to send reset email',
        isLoading: false
      });
      throw error;
    }
  },

  // Reset Password
  resetPassword: async (token, password) => {
    try {
      set({ isLoading: true, error: null });
      await axios.post(`${API_URL}/auth/reset-password`, { token, password });
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to reset password',
        isLoading: false
      });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
      throw error;
    }
  },

  // Update User Profile
  updateProfile: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.put(`${API_URL}/user/profile`, userData, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('token')}`
        }
      });

      const updatedUser = response.data;
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

      set({
        user: updatedUser,
        isLoading: false
      });

      return updatedUser;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update profile',
        isLoading: false
      });
      throw error;
    }
  }
}));

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    initialize,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    updateProfile
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    initialize,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    updateProfile
  };
}; 