import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Title, Paragraph, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS, SPACING } from '../constants/config';

const VendorCard = ({ vendor, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="store"
              size={32}
              color={COLORS.primary}
            />
            <Title style={styles.title} numberOfLines={1}>
              {vendor.shopName}
            </Title>
          </View>
          <Paragraph style={styles.description} numberOfLines={2}>
            {vendor.description}
          </Paragraph>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="star"
                size={16}
                color={COLORS.warning}
              />
              <Text style={styles.statText}>{vendor.rating?.toFixed(1) || '0.0'}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="package-variant"
                size={16}
                color={COLORS.primary}
              />
              <Text style={styles.statText}>{vendor.productCount || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons
                name="map-marker"
                size={16}
                color={COLORS.danger}
              />
              <Text style={styles.statText}>{vendor.distance?.toFixed(1) || '0.0'} km</Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: vendor.isOpen ? COLORS.success : COLORS.danger }
            ]} />
            <Text style={styles.statusText}>
              {vendor.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    ...SHADOWS.light,
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
    flex: 1,
  },
  description: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: SPACING.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: SIZES.small,
    marginLeft: SPACING.xs,
    color: COLORS.dark,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  statusText: {
    fontSize: SIZES.small,
    color: COLORS.dark,
  },
});

export default VendorCard; 