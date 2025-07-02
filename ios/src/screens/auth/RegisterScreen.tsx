import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, Button, Card, SegmentedButtons } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { colors, spacing, typography } from '../../theme/theme';

export default function RegisterScreen({ navigation }: any) {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const { t, language } = useLanguage();

  const handleRegister = async () => {
    if (!companyName || !email || !password) {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        language === 'es' ? 'Por favor completa todos los campos requeridos' : 'Please fill in all required fields'
      );
      return;
    }

    setLoading(true);
    try {
      await register(email, password, companyName, industry);
    } catch (error: any) {
      Alert.alert(
        language === 'es' ? 'Error de Registro' : 'Registration Error',
        error.message || (language === 'es' ? 'Error al registrarse' : 'Registration failed')
      );
    } finally {
      setLoading(false);
    }
  };

  const industryOptions = [
    {
      value: 'technology',
      label: language === 'es' ? 'Tecnología' : 'Technology',
    },
    {
      value: 'finance',
      label: language === 'es' ? 'Finanzas' : 'Finance',
    },
    {
      value: 'healthcare',
      label: language === 'es' ? 'Salud' : 'Healthcare',
    },
    {
      value: 'manufacturing',
      label: language === 'es' ? 'Manufactura' : 'Manufacturing',
    },
    {
      value: 'retail',
      label: language === 'es' ? 'Comercio' : 'Retail',
    },
    {
      value: 'other',
      label: language === 'es' ? 'Otra' : 'Other',
    },
  ];

  return (
    <LinearGradient
      colors={['#dbeafe', '#ffffff', '#f0f9ff']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="business" size={48} color={colors.primary} />
            </View>
            <Text style={styles.title}>ArcusHR</Text>
            <Text style={styles.subtitle}>
              {language === 'es' 
                ? 'Crea tu empresa en la plataforma'
                : 'Create your company on the platform'}
            </Text>
          </View>

          {/* Register Form */}
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                {language === 'es' ? 'Registrar Empresa' : 'Register Company'}
              </Text>
              <Text style={styles.cardSubtitle}>
                {language === 'es' 
                  ? 'Crea una nueva cuenta de empresa'
                  : 'Create a new company account'}
              </Text>

              {/* Company Name Input */}
              <TextInput
                label={language === 'es' ? 'Nombre de la Empresa' : 'Company Name'}
                value={companyName}
                onChangeText={setCompanyName}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="domain" />}
                placeholder="Acme Corporation"
              />

              {/* Industry Input */}
              <TextInput
                label={language === 'es' ? 'Industria' : 'Industry'}
                value={industry}
                onChangeText={setIndustry}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="briefcase-outline" />}
                right={
                  <TextInput.Icon 
                    icon="menu-down" 
                    onPress={() => {
                      // In a real app, this would open a dropdown
                      Alert.alert(
                        language === 'es' ? 'Selecciona una Industria' : 'Select an Industry',
                        '',
                        industryOptions.map(option => ({
                          text: option.label,
                          onPress: () => setIndustry(option.value)
                        }))
                      );
                    }}
                  />
                }
                placeholder={language === 'es' ? 'Selecciona una industria' : 'Select an industry'}
              />

              {/* Admin Email Input */}
              <TextInput
                label={language === 'es' ? 'Correo del Administrador' : 'Admin Email'}
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={styles.input}
                left={<TextInput.Icon icon="email-outline" />}
                placeholder="admin@company.com"
              />

              {/* Password Input */}
              <TextInput
                label={t('password')}
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                placeholder="••••••••"
              />

              {/* Register Button */}
              <Button
                mode="contained"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                style={styles.registerButton}
                contentStyle={styles.registerButtonContent}
              >
                {loading 
                  ? (language === 'es' ? 'Creando Empresa...' : 'Creating Company...')
                  : (language === 'es' ? 'Crear Empresa' : 'Create Company')
                }
              </Button>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>
                  {language === 'es' ? '¿Ya tienes una cuenta?' : 'Already have an account?'}
                </Text>
                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Login')}
                  style={styles.loginButton}
                >
                  {language === 'es' ? 'Iniciar Sesión' : 'Sign In'}
                </Button>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    ...typography.h1,
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray[600],
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    padding: spacing.lg,
  },
  cardTitle: {
    ...typography.h2,
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  cardSubtitle: {
    ...typography.body,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
  },
  registerButton: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: 12,
    backgroundColor: colors.success,
  },
  registerButtonContent: {
    paddingVertical: spacing.sm,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    ...typography.body,
    color: colors.gray[600],
  },
  loginButton: {
    marginLeft: spacing.xs,
  },
});