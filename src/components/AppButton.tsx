import React from 'react';
import { Pressable, Text, StyleSheet, PressableProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, interpolateColor, useSharedValue } from 'react-native-reanimated';
import { theme } from '../theme';

interface AppButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'danger' | 'warning' | 'safe';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AppButton({ title, variant = 'primary', style, textStyle, ...props }: AppButtonProps) {
  const isPressed = useSharedValue(0);
  
  let backgroundColor = theme.colors.primary;
  switch (variant) {
    case 'danger': backgroundColor = theme.colors.statusDanger; break;
    case 'warning': backgroundColor = theme.colors.statusWarning; break;
    case 'safe': backgroundColor = theme.colors.statusSafe; break;
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isPressed.value === 1 ? 0.8 : 1, { duration: 150 }),
      transform: [{ scale: withTiming(isPressed.value === 1 ? 0.96 : 1, { duration: 150 }) }],
    };
  });

  return (
    <AnimatedPressable
      {...props}
      onPressIn={(e) => {
        isPressed.value = 1;
        props.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        isPressed.value = 0;
        props.onPressOut?.(e);
      }}
      style={[
        styles.button,
        { backgroundColor },
        animatedStyle,
        style,
      ]}
      android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.semiBold as any,
  }
});
