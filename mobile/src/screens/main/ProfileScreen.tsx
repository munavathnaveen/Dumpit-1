import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  List,
  Avatar,
  Divider,
  useTheme,
} from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
import api from '../../api/config';

interface ProfileFormValues {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  currentPassword: Yup.string().when('newPassword', (newPassword, schema) => {
    return newPassword
      ? schema.required('Current password is required')
      : schema;
  }),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

const ProfileScreen = () => {
  const theme = useTheme();
  const { user, updateProfile, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (values: ProfileFormValues) => {
    setLoading(true);
    try {
      await updateProfile({
        name: values.name,
        email: values.email,
        ...(values.newPassword && {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={user?.name?.split(' ').map((n) => n[0]).join('') || 'U'}
        />
        <Text variant="headlineSmall" style={styles.name}>
          {user?.name}
        </Text>
      </View>

      <Formik<ProfileFormValues>
        initialValues={{
          name: user?.name || '',
          email: user?.email || '',
          currentPassword: '',
          newPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleUpdateProfile}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.form}>
            <TextInput
              label="Name"
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              error={touched.name && !!errors.name}
              style={styles.input}
              mode="outlined"
            />
            {touched.name && errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}

            <TextInput
              label="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={touched.email && !!errors.email}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <Text variant="titleMedium" style={styles.sectionTitle}>
              Change Password
            </Text>

            <TextInput
              label="Current Password"
              value={values.currentPassword}
              onChangeText={handleChange('currentPassword')}
              onBlur={handleBlur('currentPassword')}
              error={touched.currentPassword && !!errors.currentPassword}
              style={styles.input}
              mode="outlined"
              secureTextEntry
            />
            {touched.currentPassword && errors.currentPassword && (
              <Text style={styles.errorText}>{errors.currentPassword}</Text>
            )}

            <TextInput
              label="New Password"
              value={values.newPassword}
              onChangeText={handleChange('newPassword')}
              onBlur={handleBlur('newPassword')}
              error={touched.newPassword && !!errors.newPassword}
              style={styles.input}
              mode="outlined"
              secureTextEntry
            />
            {touched.newPassword && errors.newPassword && (
              <Text style={styles.errorText}>{errors.newPassword}</Text>
            )}

            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              loading={loading}
              style={styles.button}
            >
              Update Profile
            </Button>
          </View>
        )}
      </Formik>

      <Divider style={styles.divider} />

      <List.Section>
        <List.Subheader>Settings</List.Subheader>
        <List.Item
          title="Notifications"
          left={(props) => <List.Icon {...props} icon="bell" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title="Privacy"
          left={(props) => <List.Icon {...props} icon="shield-lock" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title="Help & Support"
          left={(props) => <List.Icon {...props} icon="help-circle" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title="About"
          left={(props) => <List.Icon {...props} icon="information" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
        />
      </List.Section>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        textColor={theme.colors.error}
      >
        Logout
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  name: {
    marginTop: 10,
  },
  form: {
    padding: 20,
  },
  input: {
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
  },
  sectionTitle: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  divider: {
    marginVertical: 20,
  },
  logoutButton: {
    marginTop: 20,
    marginHorizontal: 20,
  },
});

export default ProfileScreen; 