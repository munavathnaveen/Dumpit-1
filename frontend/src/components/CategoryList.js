import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS, SPACING } from '../constants/config';

const CategoryList = ({ categories, onCategoryPress }) => {
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      electronics: 'laptop',
      clothing: 'tshirt-crew',
      food: 'food',
      books: 'book-open-variant',
      sports: 'basketball',
      beauty: 'face-woman',
      home: 'home',
      toys: 'toy-brick',
      health: 'heart-pulse',
      default: 'tag',
    };

    const category = categoryName.toLowerCase();
    return iconMap[category] || iconMap.default;
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category._id}
          onPress={() => onCategoryPress(category)}
          style={styles.categoryItem}
        >
          <Surface style={styles.categoryCard}>
            <MaterialCommunityIcons
              name={getCategoryIcon(category.name)}
              size={32}
              color={COLORS.primary}
            />
            <Text style={styles.categoryName} numberOfLines={1}>
              {category.name}
            </Text>
          </Surface>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingRight: SPACING.md,
  },
  categoryItem: {
    marginRight: SPACING.md,
  },
  categoryCard: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.light,
  },
  categoryName: {
    fontSize: SIZES.small,
    marginTop: SPACING.xs,
    textAlign: 'center',
    color: COLORS.dark,
  },
});

export default CategoryList; 