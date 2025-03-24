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

const RegisterScreen = ({ navigation }) => {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.name) {
      errors.name = ERROR_MESSAGES.validation.required;
    }
    if (!formData.email) {
      errors.email = ERROR_MESSAGES.validation.required;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = ERROR_MESSAGES.validation.email;
    }
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
    if (!formData.phone) {
      errors.phone = ERROR_MESSAGES.validation.required;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = ERROR_MESSAGES.validation.phone;
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Registration successful! Please log in.',
      });
      navigation.navigate('Login');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || ERROR_MESSAGES.auth.register,
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <View style={styles.form}>
            <TextInput
              label="Full Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              mode="outlined"
              error={!!validationErrors.name}
              style={styles.input}
            />
            {validationErrors.name && (
              <HelperText type="error" visible={!!validationErrors.name}>
                {validationErrors.name}
              </HelperText>
            )}

            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!validationErrors.email}
              style={styles.input}
            />
            {validationErrors.email && (
              <HelperText type="error" visible={!!validationErrors.email}>
                {validationErrors.email}
              </HelperText>
            )}

            <TextInput
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              mode="outlined"
              keyboardType="phone-pad"
              error={!!validationErrors.phone}
              style={styles.input}
            />
            {validationErrors.phone && (
              <HelperText type="error" visible={!!validationErrors.phone}>
                {validationErrors.phone}
              </HelperText>
            )}

            <TextInput
              label="Password"
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
              label="Confirm Password"
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
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
            >
              Sign Up
            </Button>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  loginText: {
    color: COLORS.gray,
    fontSize: SIZES.font,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
});

export default RegisterScreen; 