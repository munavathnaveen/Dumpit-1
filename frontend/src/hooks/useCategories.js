import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../constants/config';

const useCategoryStore = create((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/categories`);
      set({ categories: response.data.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch categories',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchCategoryById: async (categoryId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/categories/${categoryId}`);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch category details',
        isLoading: false,
      });
      throw error;
    }
  },

  searchCategories: async (query) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/search/categories`, {
        params: { query },
      });
      set({ categories: response.data.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to search categories',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export const useCategories = () => {
  const {
    categories,
    isLoading,
    error,
    fetchCategories,
    fetchCategoryById,
    searchCategories,
    clearError,
  } = useCategoryStore();

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    fetchCategoryById,
    searchCategories,
    clearError,
  };
}; 