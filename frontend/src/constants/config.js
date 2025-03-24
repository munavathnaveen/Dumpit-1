export const API_URL = 'http://localhost:5000/api';

export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  info: '#5856D6',
  light: '#F2F2F7',
  dark: '#1C1C1E',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  background: '#F2F2F7',
  card: '#FFFFFF',
  text: '#000000',
  border: '#C6C6C8',
  notification: '#FF3B30',
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.gray,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  medium: {
    shadowColor: COLORS.gray,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  dark: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
};

export const FONTS = {
  regular: 'System',
  medium: 'System-Medium',
  bold: 'System-Bold',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
};

export const STORAGE_KEYS = {
  token: 'token',
  user: 'user',
  cart: 'cart',
  favorites: 'favorites',
};

export const ERROR_MESSAGES = {
  network: 'Please check your internet connection',
  server: 'Something went wrong. Please try again later.',
  auth: {
    login: 'Invalid email or password',
    register: 'Registration failed. Please try again.',
    forgotPassword: 'Failed to send reset email. Please try again.',
    resetPassword: 'Failed to reset password. Please try again.',
  },
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    password: 'Password must be at least 6 characters long',
    phone: 'Please enter a valid phone number',
  },
};

export const SUCCESS_MESSAGES = {
  login: 'Successfully logged in',
  register: 'Registration successful',
  forgotPassword: 'Reset email sent successfully',
  resetPassword: 'Password reset successful',
  profileUpdate: 'Profile updated successfully',
  orderPlaced: 'Order placed successfully',
  paymentSuccess: 'Payment successful',
}; 