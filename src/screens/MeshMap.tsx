import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type MeshMapScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export function MeshMapScreen({ navigation }: MeshMapScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={theme.colors.textDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Mesh Map</Text>
        <View style={{ width: 44 }} /> {/* Placeholder for alignment */}
      </View>
      
      <View style={styles.content}>
        <Ionicons name="map" size={80} color={theme.colors.primary} style={styles.icon} />
        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.description}>
          The Decentralized Mesh Map is under construction. Soon, you will be able to view a live radar of all nearby ResQNodes and distress beacons without requiring an internet connection.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.semiBold as any,
    fontSize: 20,
    color: theme.colors.primaryDark,
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  icon: {
    marginBottom: 24,
    opacity: 0.8,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.semiBold as any,
    fontSize: 24,
    color: theme.colors.textDark,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
});
