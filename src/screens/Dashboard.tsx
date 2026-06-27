import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useDerivedValue } from 'react-native-reanimated';
import { theme } from '../theme';
import { AppButton } from '../components/AppButton';
import { RadarPulse } from '../components/RadarPulse';
import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Q } from '@nozbe/watermelondb';
import { database } from '../db';

type DashboardScreenProps = {
  navigation: DrawerNavigationProp<any>;
};

type NetworkStatus = 'safe' | 'emergency';

import { ForegroundService } from '../services/ForegroundService';

const { width } = Dimensions.get('window');

export function DashboardScreen({ navigation }: DashboardScreenProps) {
  const [status, setStatus] = useState<NetworkStatus>('safe');
  const [nodesNearby, setNodesNearby] = useState(0);
  const [isSynced, setIsSynced] = useState(true);

  useEffect(() => {
    // Start foreground scanning service
    ForegroundService.start();

    // Observe active emergency beacons from the local database.
    // If any active beacons exist, the network status is 'emergency'.
    const beaconSubscription = database.collections
      .get('emergency_beacons')
      .query(Q.where('status', 'active'))
      .observe()
      .subscribe(activeBeacons => {
        setStatus(activeBeacons.length > 0 ? 'emergency' : 'safe');
      });

    // Observe all mesh nodes to get an accurate nearby count.
    const nodeSubscription = database.collections
      .get('mesh_nodes')
      .query()
      .observeCount()
      .subscribe(count => {
        setNodesNearby(count);
      });

    return () => {
      beaconSubscription.unsubscribe();
      nodeSubscription.unsubscribe();
    };
  }, []);

  const animatedHeroStyle = useAnimatedStyle(() => {
    const backgroundColor = withTiming(
      status === 'safe' ? theme.colors.statusSafe : theme.colors.statusDanger,
      { duration: 800 }
    );
    return { backgroundColor };
  });

  const radarColor = status === 'safe' ? theme.colors.primary : theme.colors.statusDanger;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.openDrawer()} style={styles.iconButton}>
          <Ionicons name="menu" size={28} color={theme.colors.textDark} />
        </Pressable>
        
        <Text style={styles.headerTitle}>ResQNode</Text>
        
        <View style={styles.iconButton}>
          <Ionicons 
            name={isSynced ? "cloud-done" : "cloud-offline"} 
            size={24} 
            color={isSynced ? theme.colors.statusSafe : theme.colors.textMuted} 
          />
        </View>
      </View>

      {/* Hero Card */}
      <Animated.View style={[styles.heroCard, animatedHeroStyle]}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            {status === 'safe' ? 'You are Safe.' : 'EMERGENCY NEARBY.'}
          </Text>
          <Text style={styles.heroSubtitle}>
            {status === 'safe' 
              ? `${nodesNearby} Mesh Nodes nearby.` 
              : `Asthma Pump required 40 meters away.`}
          </Text>
        </View>
        
        {/* Radar Animation centered in Hero Card */}
        <View style={styles.radarContainer}>
           <RadarPulse color={radarColor} size={width * 0.6} />
           {/* Center Icon */}
           <View style={styles.radarCenter}>
             <Ionicons 
               name={status === 'safe' ? "shield-checkmark" : "warning"} 
               size={40} 
               color="#FFF" 
             />
           </View>
        </View>
      </Animated.View>

      {/* Action Grid */}
      <View style={styles.actionGrid}>
        <View style={styles.gridRow}>
          <AppButton 
            title="🚨 Broadcast SOS" 
            variant="danger" 
            style={styles.gridButton} 
            onPress={() => navigation.navigate('SOS')} 
          />
          <AppButton 
            title="📦 Offer Supplies" 
            variant="primary" 
            style={styles.gridButton} 
            onPress={() => navigation.navigate('OfferSupplies')}
          />
        </View>
        <View style={styles.gridRow}>
          <AppButton 
            title="📡 View Mesh Map" 
            variant="primary" 
            style={styles.gridButton} 
            onPress={() => navigation.navigate('MeshMap')}
          />
          <AppButton 
            title="🗣️ Voice Translator" 
            variant="primary" 
            style={styles.gridButton} 
            onPress={() => navigation.navigate('Translator')}
          />
        </View>
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
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.semiBold as any,
    fontSize: 20,
    color: theme.colors.primaryDark,
    letterSpacing: 0.5,
  },
  heroCard: {
    flex: 1, // Takes about 50% of screen since actionGrid takes the rest
    margin: 16,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  heroContent: {
    padding: 24,
    zIndex: 10,
  },
  heroTitle: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.semiBold as any,
    fontSize: 28,
    color: '#FFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 24,
  },
  radarContainer: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarCenter: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionGrid: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridButton: {
    flex: 1,
    height: 100,
  },
});
