import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { TextInput, Button, Text, Surface, HelperText } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';
import { COLORS, SIZES, SHADOWS, SPACING, ERROR_MESSAGES } from '../../constants/config';
import Toast from 'react-native-toast-message';

const ResetPasswordScreen = ({ route, navigation }) => {
  const { resetPassword, isLoading } = useAuth();
  const { token } = route.params;
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.password) {
      errors.password = ERROR_MESSAGES.validation.required;
    } else if (formData.password.length < 6) {
      errors.password = ERROR_MESSAGES.validation.password;
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = ERROR_MESSAGES.validation.required;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = ERROR_MESSAGES.validation.confirmPassword;
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    try {
      await resetPassword(token, formData.password);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password has been reset successfully',
      });
      navigation.navigate('Login');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || ERROR_MESSAGES.auth.resetPassword,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Surface style={styles.surface}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Please enter your new password below
          </Text>

          <View style={styles.form}>
            <TextInput
              label="New Password"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              mode="outlined"
              secureTextEntry
              error={!!validationErrors.password}
              style={styles.input}
            />
            {validationErrors.password && (
              <HelperText type="error" visible={!!validationErrors.password}>
                {validationErrors.password}
              </HelperText>
            )}

            <TextInput
              label="Confirm New Password"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              mode="outlined"
              secureTextEntry
              error={!!validationErrors.confirmPassword}
              style={styles.input}
            />
            {validationErrors.confirmPassword && (
              <HelperText type="error" visible={!!validationErrors.confirmPassword}>
                {validationErrors.confirmPassword}
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleResetPassword}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
            >
              Reset Password
            </Button>

            <View style={styles.backContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.backLink}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  surface: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.medium,
  },
  title: {
    fontSize: SIZES.extraLarge,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginBottom: SPACING.xl,
    lineHeight: SIZES.medium * 1.5,
  },
  form: {
    gap: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.white,
  },
  button: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  backContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  backLink: {
    color: COLORS.primary,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
});

export default ResetPasswordScreen; 