import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import { State, TapGestureHandler, LongPressGestureHandler, GestureHandlerRootView, HandlerStateChangeEvent } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Mock MVP Dictionary (English -> Target Language for demo)
const MVP_DICTIONARY: Record<string, string> = {
  'need doctor': 'Necesito un doctor',
  'water': 'Agua',
  'safe': 'Estoy a salvo',
  'help': 'Ayuda',
  'food': 'Comida',
  'danger': 'Peligro',
};

export function TranslatorScreen() {
  const [recognizedText, setRecognizedText] = useState('Hold button and speak...');
  const [translatedText, setTranslatedText] = useState('...');
  const [isRecording, setIsRecording] = useState(false);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Initialize TTS
    Tts.setDefaultLanguage('es-ES');
    Tts.setDefaultRate(0.5);

    // Initialize Voice STT
    Voice.onSpeechStart = () => setIsRecording(true);
    Voice.onSpeechEnd = () => setIsRecording(false);
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      const text = e.value?.[0] || '';
      setRecognizedText(text);
      translateText(text);
    };
    Voice.onSpeechError = (e) => {
      setIsRecording(false);
      setRecognizedText('Error recognizing speech.');
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      Tts.stop();
    };
  }, []);

  const translateText = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // MVP: Check dictionary
    let translation = 'Translation not found in offline dictionary.';
    for (const key of Object.keys(MVP_DICTIONARY)) {
      if (lowerText.includes(key)) {
        translation = MVP_DICTIONARY[key];
        break;
      }
    }

    setTranslatedText(translation);
    
    // Auto-speak translation
    if (translation !== 'Translation not found in offline dictionary.') {
      Tts.speak(translation);
    }
  };

  const startRecording = async () => {
    try {
      scale.value = withSpring(1.2);
      setRecognizedText('Listening (Offline)...');
      setTranslatedText('...');
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecording = async () => {
    try {
      scale.value = withSpring(1);
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const onHandlerStateChange = (event: HandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.BEGAN || event.nativeEvent.state === State.ACTIVE) {
      if (!isRecording) startRecording();
    } else if (
      event.nativeEvent.state === State.END || 
      event.nativeEvent.state === State.FAILED || 
      event.nativeEvent.state === State.CANCELLED
    ) {
      stopRecording();
    }
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* TOP HALF - INVERTED FOR OPPOSITE PERSON */}
      <View style={styles.topHalf}>
        <Text style={styles.topLabel}>Target Language (Spanish)</Text>
        <Text style={styles.topText}>{translatedText}</Text>
      </View>

      <View style={styles.divider} />

      {/* BOTTOM HALF - FOR USER */}
      <View style={styles.bottomHalf}>
        <Text style={styles.bottomText}>{recognizedText}</Text>
        <Text style={styles.bottomLabel}>English (You)</Text>
        
        <View style={styles.buttonWrapper}>
          <LongPressGestureHandler 
            onHandlerStateChange={onHandlerStateChange} 
            minDurationMs={200}
          >
            <Animated.View style={[styles.micButton, animatedButtonStyle, { backgroundColor: isRecording ? theme.colors.statusDanger : theme.colors.primary }]}>
              <Ionicons name="mic" size={48} color="#FFF" />
              <Text style={styles.micButtonText}>Hold to Talk</Text>
            </Animated.View>
          </LongPressGestureHandler>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgLight,
  },
  topHalf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryDark,
    transform: [{ rotate: '180deg' }], // Inverted for the person opposite
    padding: 24,
  },
  topLabel: {
    fontFamily: theme.typography.fontFamily,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 8,
  },
  topText: {
    fontFamily: theme.typography.fontFamily,
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  divider: {
    height: 4,
    backgroundColor: '#000',
  },
  bottomHalf: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  bottomLabel: {
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.textMuted,
    fontSize: 14,
    marginTop: 8,
  },
  bottomText: {
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.textDark,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  micButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  micButtonText: {
    fontFamily: theme.typography.fontFamily,
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 8,
  },
});
