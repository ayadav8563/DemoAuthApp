// src/screens/LoginScreen.tsx
import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Button, InputField } from '../components';
import { useLoginForm } from '../hooks/useLoginForm';
import { useAuthContext } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';

type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { error, clearError } = useAuthContext();
  const {
    credentials,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  // Clear auth errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const navigateToSignup = useCallback(() => {
    navigation.navigate('Signup');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to access your account
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {error && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{error}</Text>
                </View>
              )}

              <InputField
                label="Email Address"
                value={credentials.email}
                onChangeText={(text) => handleChange('email', text)}
                placeholder="Enter your email"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
                leftIcon={
                  <Text style={styles.inputIcon}>📧</Text>
                }
              />

              <InputField
                label="Password"
                value={credentials.password}
                onChangeText={(text) => handleChange('password', text)}
                placeholder="Enter your password"
                type="password"
                secureTextEntry
                error={errors.password}
                leftIcon={
                  <Text style={styles.inputIcon}>🔒</Text>
                }
              />

              <Button
                title="Sign In"
                onPress={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
                variant="primary"
                style={styles.submitButton}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <Button
                title="Create New Account"
                onPress={navigateToSignup}
                variant="outline"
                style={styles.signupButton}
              />

              {/* Demo Credentials */}
              <View style={styles.demoSection}>
                <Text style={styles.demoTitle}>Demo Credentials</Text>
                <View style={styles.demoCredentials}>
                  <Text style={styles.demoText}>
                    Email: ankit+1@gmail.com
                  </Text>
                  <Text style={styles.demoText}>
                    Password: Ankit1
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  errorBanner: {
    backgroundColor: '#F8D7DA',
    borderLeftWidth: 4,
    borderLeftColor: '#DC3545',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  errorBannerText: {
    color: '#721C24',
    fontSize: 14,
  },
  inputIcon: {
    fontSize: 20,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E9ECEF',
  },
  dividerText: {
    paddingHorizontal: 16,
    color: '#6C757D',
    fontSize: 14,
  },
  signupButton: {
    marginBottom: 32,
  },
  demoSection: {
    backgroundColor: '#E7F5FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#339AF0',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1864AB',
    marginBottom: 8,
  },
  demoCredentials: {
    gap: 4,
  },
  demoText: {
    fontSize: 12,
    color: '#495057',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});