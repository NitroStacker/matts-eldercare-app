import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows, layout } from '../theme/AppleDesignSystem';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  username: string;
  onComplete: () => void;
}

// TODO: Replace this with the actual medicine logo from medicine.json
const MedicineLogo = () => {
  return (
    <View style={styles.logoContainer}>
      <Ionicons name="medical" size={80} color={colors.systemBackground} />
    </View>
  );
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ username, onComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Wait 2 seconds, then fade out
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onComplete();
        });
      }, 2000);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <MedicineLogo />
        </View>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.username}>{username}!</Text>
        <Text style={styles.subtitle}>Your eldercare journey continues</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.systemGroupedBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: spacing.xxxl,
  },
  iconContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: colors.systemBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.large,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    ...typography.title2,
    color: colors.secondaryLabel,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  username: {
    ...typography.largeTitle,
    color: colors.systemBlue,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.secondaryLabel,
    textAlign: 'center',
  },
});

export default WelcomeScreen;
