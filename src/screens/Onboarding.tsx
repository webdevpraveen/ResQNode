import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { AppButton } from '../components/AppButton';
import { theme } from '../theme';
import { PermissionsManager } from '../utils/PermissionsManager';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const { width } = Dimensions.get('window');

export function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGrantPermissions = async () => {
    try {
      const granted = await PermissionsManager.requestBluetoothPermissions();
      if (granted) {
        navigation.replace('Root');
      } else {
        setErrorMsg('Permissions are required for the offline Mesh Network to function. Please grant them.');
      }
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to request permissions.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="bluetooth" size={80} color={theme.colors.primary} style={styles.icon} />
        
        <Text style={styles.title}>Join the Mesh</Text>
        
        <Text style={styles.description}>
          ResQNode operates entirely offline using a Bluetooth Mesh Network. To detect SOS signals and broadcast your own, the app requires precise location and Bluetooth permissions.
        </Text>

        <View style={styles.alertBox}>
          <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
          <Text style={styles.alertText}>
            For the Offline Voice Translator to work without internet, please ensure you download the "Offline Speech Recognition" language packs in your Android Settings.
          </Text>
        </View>

        {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      </View>
      
      <View style={styles.footer}>
        <AppButton 
          title="Grant Permissions" 
          onPress={handleGrantPermissions} 
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 32,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.semiBold as any,
    fontSize: 28,
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
  errorText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.statusDanger,
    marginTop: 20,
    textAlign: 'center',
  },
  alertBox: {
    flexDirection: 'row',
    backgroundColor: '#E6F4F1',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  alertText: {
    flex: 1,
    marginLeft: 12,
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.primaryDark,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  }
});
