import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING } from '../constants/config';

const ErrorMessage = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="alert-circle"
        size={48}
        color={COLORS.danger}
      />
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button
          mode="contained"
          onPress={onRetry}
          style={styles.button}
        >
          Try Again
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  message: {
    marginTop: SPACING.md,
    fontSize: SIZES.medium,
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  button: {
    marginTop: SPACING.md,
  },
});

export default ErrorMessage; 