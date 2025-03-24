import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { TextInput, IconButton, Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS, SPACING } from '../../constants/config';

const Header = ({
  title,
  showSearch = false,
  onSearch,
  onBack,
  onMenu,
  rightIcon,
  onRightPress,
  showCart = false,
  cartCount = 0,
  onCartPress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text) => {
    setSearchQuery(text);
    onSearch?.(text);
  };

  return (
    <Surface style={styles.header}>
      <View style={styles.leftSection}>
        {onBack ? (
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={onBack}
            iconColor={COLORS.dark}
          />
        ) : onMenu ? (
          <IconButton
            icon="menu"
            size={24}
            onPress={onMenu}
            iconColor={COLORS.dark}
          />
        ) : null}
      </View>

      {showSearch ? (
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color={COLORS.gray}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.searchInput}
            mode="flat"
          />
        </View>
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}

      <View style={styles.rightSection}>
        {showCart && (
          <TouchableOpacity onPress={onCartPress} style={styles.cartButton}>
            <MaterialCommunityIcons
              name="cart"
              size={24}
              color={COLORS.dark}
            />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartCount}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        {rightIcon && (
          <IconButton
            icon={rightIcon}
            size={24}
            onPress={onRightPress}
            iconColor={COLORS.dark}
          />
        )}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.sm,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.white,
    ...SHADOWS.light,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    flex: 1,
    textAlign: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: SIZES.base * 2,
    marginHorizontal: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: SIZES.font,
  },
  cartButton: {
    position: 'relative',
    marginRight: SPACING.xs,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.base,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartCount: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: 'bold',
  },
});

export default Header; 