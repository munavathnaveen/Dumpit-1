import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/constants/config';

const theme = {
  colors: {
    primary: COLORS.primary,
    accent: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.white,
    error: COLORS.danger,
    text: COLORS.dark,
    onSurface: COLORS.dark,
    disabled: COLORS.gray,
    placeholder: COLORS.gray,
    backdrop: COLORS.gray,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AppNavigator />
        <Toast />
      </PaperProvider>
    </SafeAreaProvider>
  );
} 