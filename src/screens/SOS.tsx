import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { BleBroadcasterService } from '../services/BleBroadcasterService';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withRepeat, withTiming, useSharedValue, Easing } from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function SOSScreen() {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const pulse = useSharedValue(1);

  const toggleBeacon = async () => {
    if (isBroadcasting) {
      BleBroadcasterService.stopBeacon();
      setIsBroadcasting(false);
      pulse.value = 1;
    } else {
      await BleBroadcasterService.startSOSBeacon();
      setIsBroadcasting(true);
      pulse.value = withRepeat(
        withTiming(1.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse.value }],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Emergency Beacon</Text>
        <Text style={styles.description}>
          Activate this beacon to broadcast an offline SOS signal to the mesh network. Ensure your Bluetooth is on.
        </Text>

        <View style={styles.buttonContainer}>
          <AnimatedTouchable
            style={[
              styles.sosButton,
              animatedStyle,
              { backgroundColor: isBroadcasting ? theme.colors.statusDanger : theme.colors.primaryDark }
            ]}
            onPress={toggleBeacon}
            activeOpacity={0.8}
          >
            <Ionicons name="radio" size={64} color="#FFF" />
            <Text style={styles.sosButtonText}>
              {isBroadcasting ? 'BEACON ACTIVE' : 'ACTIVATE BEACON'}
            </Text>
          </AnimatedTouchable>
        </View>

        {isBroadcasting && (
          <Text style={styles.statusText}>
            Broadcasting 31-byte SOS payload via Bluetooth Low Energy...
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgLight,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 28,
    fontWeight: theme.typography.weights.semiBold as any,
    color: theme.colors.textDark,
    marginBottom: 12,
  },
  description: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 60,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButton: {
    width: 250,
    height: 250,
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: theme.colors.statusDanger,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  sosButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 16,
  },
  statusText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.statusDanger,
    textAlign: 'center',
    marginTop: 40,
  },
});
