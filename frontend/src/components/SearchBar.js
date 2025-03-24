import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Searchbar, IconButton } from 'react-native-paper';
import { COLORS, SIZES, SHADOWS, SPACING } from '../constants/config';

const SearchBar = ({ onSearch, style }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <View style={[styles.container, style]}>
      <Searchbar
        placeholder="Search products..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.input}
        iconColor={COLORS.primary}
        placeholderTextColor={COLORS.gray}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        clearIcon={() => (
          searchQuery ? (
            <IconButton
              icon="close"
              size={20}
              onPress={handleClear}
              iconColor={COLORS.gray}
            />
          ) : null
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...SHADOWS.light,
  },
  searchBar: {
    backgroundColor: COLORS.white,
    elevation: 0,
    borderRadius: SIZES.radius,
  },
  input: {
    fontSize: SIZES.font,
    color: COLORS.dark,
  },
});

export default SearchBar; 