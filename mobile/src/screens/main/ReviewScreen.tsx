import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  Text,
  Card,
  useTheme,
  TextInput,
  Button,
  IconButton,
  HelperText,
} from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import api from '../../api/config';

type RootStackParamList = {
  Review: {
    type: 'product' | 'vendor';
    id: string;
    name: string;
    image?: string;
  };
};
type ReviewScreenRouteProp = RouteProp<RootStackParamList, 'Review'>;
type ReviewScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ReviewFormValues {
  rating: number;
  comment: string;
}

const validationSchema = Yup.object().shape({
  rating: Yup.number()
    .required('Rating is required')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  comment: Yup.string()
    .required('Comment is required')
    .min(10, 'Comment must be at least 10 characters')
    .max(500, 'Comment must be at most 500 characters'),
});

const ReviewScreen = () => {
  const route = useRoute<ReviewScreenRouteProp>();
  const navigation = useNavigation<ReviewScreenNavigationProp>();
  const theme = useTheme();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: ReviewFormValues) => {
    try {
      setSubmitting(true);
      setError(null);

      const endpoint = route.params.type === 'product' ? 'products' : 'vendors';
      await api.post(`/${endpoint}/${route.params.id}/reviews`, values);

      navigation.goBack();
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error('Failed to submit review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content style={styles.headerContent}>
          {route.params.image && (
            <Image
              source={{ uri: route.params.image }}
              style={styles.headerImage}
            />
          )}
          <View style={styles.headerInfo}>
            <Text variant="titleLarge">
              Review {route.params.type === 'product' ? 'Product' : 'Vendor'}
            </Text>
            <Text variant="titleMedium">{route.params.name}</Text>
          </View>
        </Card.Content>
      </Card>

      <Formik
        initialValues={{ rating: 5, comment: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <Card style={styles.formCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Rating
              </Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <IconButton
                    key={star}
                    icon={star <= values.rating ? 'star' : 'star-outline'}
                    size={32}
                    iconColor={star <= values.rating ? '#FFD700' : '#ccc'}
                    onPress={() => setFieldValue('rating', star)}
                  />
                ))}
              </View>
              {touched.rating && errors.rating && (
                <HelperText type="error">{errors.rating}</HelperText>
              )}

              <Text variant="titleMedium" style={styles.sectionTitle}>
                Your Review
              </Text>
              <TextInput
                mode="outlined"
                multiline
                numberOfLines={4}
                value={values.comment}
                onChangeText={handleChange('comment')}
                onBlur={handleBlur('comment')}
                placeholder="Share your experience..."
                style={styles.commentInput}
              />
              {touched.comment && errors.comment && (
                <HelperText type="error">{errors.comment}</HelperText>
              )}

              {error && (
                <HelperText type="error" style={styles.errorText}>
                  {error}
                </HelperText>
              )}

              <Button
                mode="contained"
                onPress={() => handleSubmit()}
                loading={submitting}
                disabled={submitting}
                style={styles.submitButton}
              >
                Submit Review
              </Button>
            </Card.Content>
          </Card>
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
  headerCard: {
    margin: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  formCard: {
    margin: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  commentInput: {
    marginBottom: 16,
  },
  errorText: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
}); 