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
  RadioButton,
  Divider,
  useTheme,
  Card,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useCart } from '../../context/CartContext';
import api from '../../api/config';

type RootStackParamList = {
  OrderConfirmation: { orderId: string };
};

type CheckoutScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface AddressFormValues {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code')
    .required('ZIP code is required'),
  phone: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .required('Phone number is required'),
});

const CheckoutScreen = () => {
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const theme = useTheme();
  const { items, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePlaceOrder = async (values: AddressFormValues) => {
    setLoading(true);
    try {
      const response = await api.post('/orders', {
        items,
        shippingAddress: values,
        paymentMethod,
      });
      clearCart();
      navigation.navigate('OrderConfirmation', { orderId: response.data.id });
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Formik<AddressFormValues>
        initialValues={{
          fullName: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          phone: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handlePlaceOrder}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View>
            <Card style={styles.section}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Shipping Address
                </Text>
                <TextInput
                  label="Full Name"
                  value={values.fullName}
                  onChangeText={handleChange('fullName')}
                  onBlur={handleBlur('fullName')}
                  error={touched.fullName && !!errors.fullName}
                  style={styles.input}
                  mode="outlined"
                />
                {touched.fullName && errors.fullName && (
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                )}

                <TextInput
                  label="Address"
                  value={values.address}
                  onChangeText={handleChange('address')}
                  onBlur={handleBlur('address')}
                  error={touched.address && !!errors.address}
                  style={styles.input}
                  mode="outlined"
                />
                {touched.address && errors.address && (
                  <Text style={styles.errorText}>{errors.address}</Text>
                )}

                <View style={styles.row}>
                  <TextInput
                    label="City"
                    value={values.city}
                    onChangeText={handleChange('city')}
                    onBlur={handleBlur('city')}
                    error={touched.city && !!errors.city}
                    style={[styles.input, styles.flex1]}
                    mode="outlined"
                  />
                  <TextInput
                    label="State"
                    value={values.state}
                    onChangeText={handleChange('state')}
                    onBlur={handleBlur('state')}
                    error={touched.state && !!errors.state}
                    style={[styles.input, styles.flex1]}
                    mode="outlined"
                  />
                </View>
                {touched.city && errors.city && (
                  <Text style={styles.errorText}>{errors.city}</Text>
                )}
                {touched.state && errors.state && (
                  <Text style={styles.errorText}>{errors.state}</Text>
                )}

                <View style={styles.row}>
                  <TextInput
                    label="ZIP Code"
                    value={values.zipCode}
                    onChangeText={handleChange('zipCode')}
                    onBlur={handleBlur('zipCode')}
                    error={touched.zipCode && !!errors.zipCode}
                    style={[styles.input, styles.flex1]}
                    mode="outlined"
                    keyboardType="numeric"
                  />
                  <TextInput
                    label="Phone"
                    value={values.phone}
                    onChangeText={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    error={touched.phone && !!errors.phone}
                    style={[styles.input, styles.flex1]}
                    mode="outlined"
                    keyboardType="phone-pad"
                  />
                </View>
                {touched.zipCode && errors.zipCode && (
                  <Text style={styles.errorText}>{errors.zipCode}</Text>
                )}
                {touched.phone && errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}
              </Card.Content>
            </Card>

            <Card style={styles.section}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Payment Method
                </Text>
                <RadioButton.Group
                  onValueChange={setPaymentMethod}
                  value={paymentMethod}
                >
                  <View style={styles.radioItem}>
                    <RadioButton value="card" />
                    <Text>Credit/Debit Card</Text>
                  </View>
                  <View style={styles.radioItem}>
                    <RadioButton value="upi" />
                    <Text>UPI</Text>
                  </View>
                  <View style={styles.radioItem}>
                    <RadioButton value="cod" />
                    <Text>Cash on Delivery</Text>
                  </View>
                </RadioButton.Group>
              </Card.Content>
            </Card>

            <Card style={styles.section}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Order Summary
                </Text>
                {items.map((item) => (
                  <View key={item.id} style={styles.orderItem}>
                    <Text>{item.name}</Text>
                    <Text>
                      {item.quantity}x ${item.price.toFixed(2)}
                    </Text>
                  </View>
                ))}
                <Divider style={styles.divider} />
                <View style={styles.totalContainer}>
                  <Text variant="titleMedium">Total:</Text>
                  <Text variant="titleMedium" style={styles.totalAmount}>
                    ${getTotal().toFixed(2)}
                  </Text>
                </View>
              </Card.Content>
            </Card>

            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              loading={loading}
              style={styles.button}
            >
              Place Order
            </Button>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  flex1: {
    flex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmount: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  button: {
    margin: 16,
  },
});

export default CheckoutScreen; 