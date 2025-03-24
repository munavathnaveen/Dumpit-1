import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../constants/config';

const useProductStore = create((set) => ({
  products: [],
  featuredProducts: [],
  isLoading: false,
  error: null,

  fetchProducts: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/products`, { params });
      set({ products: response.data.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch products',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchFeaturedProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/products`, {
        params: { featured: true },
      });
      set({ featuredProducts: response.data.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch featured products',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchProductById: async (productId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/products/${productId}`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch product details',
        isLoading: false,
      });
      throw error;
    }
  },

  searchProducts: async (query, filters = {}) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/search`, {
        params: { query, ...filters },
      });
      set({ products: response.data.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to search products',
        isLoading: false,
      });
      throw error;
    }
  },

  getProductsByCategory: async (categoryId, params = {}) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/products`, {
        params: { category: categoryId, ...params },
      });
      set({ products: response.data.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch category products',
        isLoading: false,
      });
      throw error;
    }
  },

  getProductsByVendor: async (vendorId, params = {}) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/products`, {
        params: { vendor: vendorId, ...params },
      });
      set({ products: response.data.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch vendor products',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export const useProducts = () => {
  const {
    products,
    featuredProducts,
    isLoading,
    error,
    fetchProducts,
    fetchFeaturedProducts,
    fetchProductById,
    searchProducts,
    getProductsByCategory,
    getProductsByVendor,
    clearError,
  } = useProductStore();

  return {
    products,
    featuredProducts,
    isLoading,
    error,
    fetchProducts,
    fetchFeaturedProducts,
    fetchProductById,
    searchProducts,
    getProductsByCategory,
    getProductsByVendor,
    clearError,
  };
}; 