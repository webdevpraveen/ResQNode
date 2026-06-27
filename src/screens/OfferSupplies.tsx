import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppButton } from '../components/AppButton';

type OfferSuppliesScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export function OfferSuppliesScreen({ navigation }: OfferSuppliesScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={theme.colors.textDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Offer Supplies</Text>
        <View style={{ width: 44 }} />
      </View>
      
      <View style={styles.content}>
        <Ionicons name="medical" size={80} color={theme.colors.statusSafe} style={styles.icon} />
        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.description}>
          The offline supply registry will allow you to broadcast available medical, food, and shelter resources to nearby users over the mesh network.
        </Text>
        <View style={{ height: 32 }} />
        <AppButton 
          title="Return to Dashboard" 
          onPress={() => navigation.goBack()} 
        />
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
    opacity: 0.9,
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
