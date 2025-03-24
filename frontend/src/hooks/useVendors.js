import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../constants/config';

const useVendorStore = create((set) => ({
  vendors: [],
  nearbyVendors: [],
  isLoading: false,
  error: null,

  fetchVendors: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/vendors`, { params });
      set({ vendors: response.data.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch vendors',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchNearbyVendors: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/vendors/nearby`, { params });
      set({ nearbyVendors: response.data.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch nearby vendors',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchVendorById: async (vendorId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/vendors/${vendorId}`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch vendor details',
        isLoading: false,
      });
      throw error;
    }
  },

  searchVendors: async (query) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/search/shops`, {
        params: { query },
      });
      set({ vendors: response.data.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to search vendors',
        isLoading: false,
      });
      throw error;
    }
  },

  registerVendor: async (vendorData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/vendors/register`, vendorData);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to register as vendor',
        isLoading: false,
      });
      throw error;
    }
  },

  updateVendorProfile: async (vendorData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.put(`${API_URL}/vendors/profile`, vendorData);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update vendor profile',
        isLoading: false,
      });
      throw error;
    }
  },

  getVendorDashboard: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/vendors/dashboard`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch vendor dashboard',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export const useVendors = () => {
  const {
    vendors,
    nearbyVendors,
    isLoading,
    error,
    fetchVendors,
    fetchNearbyVendors,
    fetchVendorById,
    searchVendors,
    registerVendor,
    updateVendorProfile,
    getVendorDashboard,
    clearError,
  } = useVendorStore();

  return {
    vendors,
    nearbyVendors,
    isLoading,
    error,
    fetchVendors,
    fetchNearbyVendors,
    fetchVendorById,
    searchVendors,
    registerVendor,
    updateVendorProfile,
    getVendorDashboard,
    clearError,
  };
}; 