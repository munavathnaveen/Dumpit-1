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

const ForgotPasswordScreen = ({ navigation }) => {
  const { forgotPassword, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');

  const validateEmail = () => {
    if (!email) {
      setValidationError(ERROR_MESSAGES.validation.required);
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError(ERROR_MESSAGES.validation.email);
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleForgotPassword = async () => {
    if (!validateEmail()) return;

    try {
      await forgotPassword(email);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password reset instructions sent to your email',
      });
      navigation.navigate('Login');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || ERROR_MESSAGES.auth.forgotPassword,
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
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you instructions to reset your password
          </Text>

          <View style={styles.form}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!validationError}
              style={styles.input}
            />
            {validationError && (
              <HelperText type="error" visible={!!validationError}>
                {validationError}
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleForgotPassword}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
            >
              Send Reset Instructions
            </Button>

            <View style={styles.backContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
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

export default ForgotPasswordScreen; 