import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
  Extrapolation,
  SharedValue,
} from 'react-native-reanimated';

interface RadarPulseProps {
  color: string;
  size?: number;
}

export function RadarPulse({ color, size = 200 }: RadarPulseProps) {
  const progress1 = useSharedValue(0);
  const progress2 = useSharedValue(0);
  const progress3 = useSharedValue(0);

  useEffect(() => {
    const config = { duration: 2500, easing: Easing.out(Easing.ease) };
    
    progress1.value = withRepeat(withTiming(1, config), -1, false);
    
    setTimeout(() => {
      progress2.value = withRepeat(withTiming(1, config), -1, false);
    }, 800);
    
    setTimeout(() => {
      progress3.value = withRepeat(withTiming(1, config), -1, false);
    }, 1600);
  }, []);

  const createAnimatedStyle = (progress: SharedValue<number>) => {
    return useAnimatedStyle(() => {
      const scale = interpolate(progress.value, [0, 1], [0.1, 1], Extrapolation.CLAMP);
      const opacity = interpolate(progress.value, [0, 0.8, 1], [0.8, 0.2, 0], Extrapolation.CLAMP);
      
      return {
        transform: [{ scale }],
        opacity,
        backgroundColor: color,
      };
    });
  };

  const style1 = createAnimatedStyle(progress1);
  const style2 = createAnimatedStyle(progress2);
  const style3 = createAnimatedStyle(progress3);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }, style1]} />
      <Animated.View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }, style2]} />
      <Animated.View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }, style3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
  },
});
