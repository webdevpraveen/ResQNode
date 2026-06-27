import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useFonts, WorkSans_400Regular, WorkSans_500Medium, WorkSans_600SemiBold } from '@expo-google-fonts/work-sans';
import { View, Text, ActivityIndicator } from 'react-native';
import { theme } from './src/theme';

import { OnboardingScreen } from './src/screens/Onboarding';
import { DashboardScreen } from './src/screens/Dashboard';
import { SOSScreen } from './src/screens/SOS';
import { TranslatorScreen } from './src/screens/Translator';

import { MeshMapScreen } from './src/screens/MeshMap';
import { OfferSuppliesScreen } from './src/screens/OfferSupplies';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MainDrawer() {
  return (
    <Drawer.Navigator screenOptions={{ 
      headerShown: true, 
      headerStyle: { backgroundColor: theme.colors.primary },
      headerTintColor: '#fff',
    }}>
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="SOS" component={SOSScreen} />
      <Drawer.Screen name="Translator" component={TranslatorScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Root" component={MainDrawer} />
        <Stack.Screen name="MeshMap" component={MeshMapScreen} />
        <Stack.Screen name="OfferSupplies" component={OfferSuppliesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
