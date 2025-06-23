import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, User, MapPin, Sprout, Eye, EyeOff } from 'lucide-react-native';
import { Colors, getThemeColors } from '../constants/colors';
import { useAuthContext } from './AuthProvider';
import { useAppContext } from '../context/AppContext';

interface AuthScreenProps {
  onAuthSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    farmName: '',
    location: '',
    farmSize: '',
    primaryCrops: '',
  });

  const { signIn, signUp, loading, error } = useAuthContext();
  const { isDarkMode } = useAppContext();
  const theme = getThemeColors(isDarkMode);

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      if (isSignUp) {
        const userData = {
          full_name: formData.fullName,
          farm_name: formData.farmName,
          location: formData.location,
          farm_size: formData.farmSize ? parseFloat(formData.farmSize) : null,
          primary_crops: formData.primaryCrops.split(',').map(crop => crop.trim()).filter(Boolean),
        };

        await signUp(formData.email, formData.password, userData);
        Alert.alert('Success', 'Account created successfully! Please check your email for verification.');
      } else {
        await signIn(formData.email, formData.password);
        onAuthSuccess?.();
      }
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderInput = (
    field: string,
    placeholder: string,
    icon: React.ReactNode,
    options?: {
      secureTextEntry?: boolean;
      keyboardType?: 'default' | 'email-address' | 'numeric';
      multiline?: boolean;
    }
  ) => (
    <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.inputIcon}>
        {icon}
      </View>
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        value={formData[field as keyof typeof formData]}
        onChangeText={(value) => updateFormData(field, value)}
        secureTextEntry={options?.secureTextEntry && !showPassword}
        keyboardType={options?.keyboardType || 'default'}
        multiline={options?.multiline}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {field === 'password' && (
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          {showPassword ? (
            <EyeOff size={20} color={theme.textSecondary} />
          ) : (
            <Eye size={20} color={theme.textSecondary} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <LinearGradient
            colors={[Colors.primary[500], Colors.primary[600]]}
            style={styles.logoContainer}
          >
            <Sprout size={40} color="white" />
          </LinearGradient>
          <Text style={[styles.title, { color: theme.text }]}>
            {isSignUp ? 'Join AgriShield' : 'Welcome Back'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {isSignUp 
              ? 'Create your account to start protecting your crops'
              : 'Sign in to continue your farming journey'
            }
          </Text>
        </View>

        <View style={styles.form}>
          {renderInput('email', 'Email Address', <Mail size={20} color={theme.textSecondary} />, {
            keyboardType: 'email-address'
          })}

          {renderInput('password', 'Password', <Lock size={20} color={theme.textSecondary} />, {
            secureTextEntry: true
          })}

          {isSignUp && (
            <>
              {renderInput('confirmPassword', 'Confirm Password', <Lock size={20} color={theme.textSecondary} />, {
                secureTextEntry: true
              })}

              {renderInput('fullName', 'Full Name', <User size={20} color={theme.textSecondary} />)}

              {renderInput('farmName', 'Farm Name (Optional)', <Sprout size={20} color={theme.textSecondary} />)}

              {renderInput('location', 'Location (Optional)', <MapPin size={20} color={theme.textSecondary} />)}

              {renderInput('farmSize', 'Farm Size in Hectares (Optional)', <Sprout size={20} color={theme.textSecondary} />, {
                keyboardType: 'numeric'
              })}

              {renderInput('primaryCrops', 'Primary Crops (comma separated)', <Sprout size={20} color={theme.textSecondary} />)}
            </>
          )}

          {error && (
            <View style={[styles.errorContainer, { backgroundColor: Colors.accent.red + '20' }]}>
              <Text style={[styles.errorText, { color: Colors.accent.red }]}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.submitButton}
            disabled={loading}
          >
            <LinearGradient
              colors={[Colors.primary[500], Colors.primary[600]]}
              style={[styles.submitButtonGradient, loading && styles.submitButtonDisabled]}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsSignUp(!isSignUp)}
            style={styles.switchButton}
          >
            <Text style={[styles.switchButtonText, { color: theme.textSecondary }]}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <Text style={[styles.switchButtonLink, { color: Colors.primary[600] }]}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    minHeight: 24,
  },
  eyeIcon: {
    padding: 4,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  switchButtonText: {
    fontSize: 16,
  },
  switchButtonLink: {
    fontWeight: '600',
  },
});