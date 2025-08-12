import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import AnimatedView from '../components/AnimatedView';
import { colors, typography, spacing, borderRadius, shadows, layout, componentStyles } from '../theme/AppleDesignSystem';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAppContext();

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!isLogin && !name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);

    try {
      let success = false;

      if (isLogin) {
        success = await login(email, password);
        if (!success) {
          Alert.alert('Login Failed', 'Invalid email or password. Try: matt@example.com / password');
        }
      } else {
        success = await signup({
          name,
          email,
          phone,
        });
        if (!success) {
          Alert.alert('Signup Failed', 'Please try again');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <AnimatedView animationType="slideDown" duration={800}>
          <View style={styles.header}>
            <AnimatedView animationType="bounce" delay={300} duration={1000}>
              <View style={styles.logoContainer}>
                        <Image
          source={require('../assets/prescription.svg')}
          style={styles.logoImage}
          resizeMode="contain"
        />
              </View>
            </AnimatedView>
            <Text style={styles.title}>Matt's Eldercare</Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </Text>
          </View>
        </AnimatedView>

        <AnimatedView animationType="slideUp" delay={400} duration={800}>
          <View style={styles.form}>
            {!isLogin && (
              <AnimatedView animationType="fadeIn" delay={500} duration={600}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Full Name</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person" size={20} color="#6C757D" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={name}
                      onChangeText={setName}
                      placeholder="Enter your full name"
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              </AnimatedView>
            )}

            <AnimatedView animationType="fadeIn" delay={600} duration={600}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail" size={20} color="#6C757D" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </AnimatedView>

            {!isLogin && (
              <AnimatedView animationType="fadeIn" delay={700} duration={600}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Phone Number (Optional)</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="call" size={20} color="#6C757D" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="Enter your phone number"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </AnimatedView>
            )}

            <AnimatedView animationType="fadeIn" delay={800} duration={600}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed" size={20} color="#6C757D" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry
                  />
                </View>
              </View>
            </AnimatedView>

            <AnimatedView animationType="scale" delay={900} duration={600}>
              <TouchableOpacity
                style={[styles.authButton, loading && styles.authButtonDisabled]}
                onPress={handleAuth}
                disabled={loading}
              >
                <Text style={styles.authButtonText}>
                  {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                </Text>
              </TouchableOpacity>
            </AnimatedView>

            {isLogin && (
              <AnimatedView animationType="fadeIn" delay={950} duration={600}>
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={() => {
                    setEmail('matt@example.com');
                    setPassword('password');
                    handleAuth();
                  }}
                >
                  <Text style={styles.testButtonText}>Quick Test Sign In</Text>
                </TouchableOpacity>
              </AnimatedView>
            )}

            {isLogin && (
              <AnimatedView animationType="fadeIn" delay={1000} duration={600}>
                <View style={styles.demoContainer}>
                  <Text style={styles.demoText}>Demo Credentials:</Text>
                  <Text style={styles.demoCredentials}>Email: matt@example.com</Text>
                  <Text style={styles.demoCredentials}>Password: password</Text>
                </View>
              </AnimatedView>
            )}
          </View>
        </AnimatedView>

        <AnimatedView animationType="slideUp" delay={1100} duration={800}>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.footerLink}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
                 </AnimatedView>
       </ScrollView>
     </KeyboardAvoidingView>
   </SafeAreaView>
 );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.systemGroupedBackground,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  title: {
    ...typography.title1,
    color: colors.label,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.secondaryLabel,
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.subheadline,
    color: colors.label,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.systemBackground,
    borderRadius: borderRadius.large,
    borderWidth: 1,
    borderColor: colors.separator,
    paddingHorizontal: spacing.componentPadding,
    minHeight: layout.inputHeight,
    ...shadows.small,
  },
  inputIcon: {
    marginRight: spacing.md,
    color: colors.secondaryLabel,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.inputPadding,
    ...typography.body,
    color: colors.label,
  },
  authButton: {
    ...componentStyles.button.primary,
    marginTop: spacing.md,
  },
  authButtonDisabled: {
    backgroundColor: colors.tertiaryLabel,
  },
  authButtonText: {
    color: colors.systemBackground,
    ...typography.headline,
  },
  testButton: {
    backgroundColor: colors.systemGreen,
    borderRadius: borderRadius.button,
    paddingVertical: spacing.buttonPadding,
    alignItems: 'center',
    marginTop: spacing.md,
    minHeight: layout.buttonHeight,
  },
  testButtonText: {
    color: colors.systemBackground,
    ...typography.subheadline,
    fontWeight: '600',
  },
  demoContainer: {
    backgroundColor: colors.secondarySystemBackground,
    borderRadius: borderRadius.large,
    padding: spacing.componentPadding,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.separator,
  },
  demoText: {
    ...typography.subheadline,
    color: colors.systemBlue,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  demoCredentials: {
    ...typography.caption1,
    color: colors.systemBlue,
    marginBottom: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  footerText: {
    ...typography.body,
    color: colors.secondaryLabel,
  },
  footerLink: {
    ...typography.body,
    color: colors.systemBlue,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
});

export default AuthScreen;
