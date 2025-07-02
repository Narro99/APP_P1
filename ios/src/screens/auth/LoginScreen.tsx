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

type UserType = 'manager' | 'employee';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('employee');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const { t, language } = useLanguage();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        language === 'es' ? 'Por favor completa todos los campos' : 'Please fill in all fields'
      );
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert(
        language === 'es' ? 'Error de Inicio de Sesión' : 'Login Error',
        error.message || (language === 'es' ? 'Error al iniciar sesión' : 'Login failed')
      );
    } finally {
      setLoading(false);
    }
  };

  const userTypeOptions = [
    {
      value: 'employee',
      label: language === 'es' ? 'Empleado' : 'Employee',
      icon: 'person-outline',
    },
    {
      value: 'manager',
      label: language === 'es' ? 'Gerente' : 'Manager',
      icon: 'business-outline',
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
                ? 'Plataforma completa de Gestión de Recursos Humanos'
                : 'Complete Human Resource Management Platform'}
            </Text>
          </View>

          {/* Login Form */}
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                {language === 'es' ? 'Iniciar Sesión' : 'Sign In'}
              </Text>
              <Text style={styles.cardSubtitle}>
                {language === 'es' 
                  ? 'Accede a tu cuenta de ArcusHR'
                  : 'Access your ArcusHR account'}
              </Text>

              {/* User Type Selection */}
              <View style={styles.userTypeContainer}>
                <Text style={styles.userTypeLabel}>
                  {language === 'es' ? 'Soy un:' : 'I am a:'}
                </Text>
                <SegmentedButtons
                  value={userType}
                  onValueChange={(value) => setUserType(value as UserType)}
                  buttons={userTypeOptions}
                  style={styles.segmentedButtons}
                />
              </View>

              {/* Email Input */}
              <TextInput
                label={t('email')}
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={styles.input}
                left={<TextInput.Icon icon="email-outline" />}
                placeholder={userType === 'manager' ? 'admin@company.com' : 'employee@company.com'}
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

              {/* Login Button */}
              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.loginButton}
                contentStyle={styles.loginButtonContent}
              >
                {loading 
                  ? (language === 'es' ? 'Iniciando sesión...' : 'Signing in...')
                  : (language === 'es' ? 'Iniciar Sesión' : 'Sign In')
                }
              </Button>

              {/* Register Link */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>
                  {language === 'es' ? '¿No tienes cuenta?' : "Don't have an account?"}
                </Text>
                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Register')}
                  style={styles.registerButton}
                >
                  {language === 'es' ? 'Crear Empresa' : 'Create Company'}
                </Button>
              </View>

              {/* Demo Credentials */}
              <View style={styles.demoContainer}>
                <Text style={styles.demoTitle}>
                  {language === 'es' ? 'Credenciales de Demo:' : 'Demo Credentials:'}
                </Text>
                <Text style={styles.demoText}>
                  Admin: admin@demo.com / admin123
                </Text>
                <Text style={styles.demoText}>
                  Empleado: employee@demo.com / employee123
                </Text>
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
  userTypeContainer: {
    marginBottom: spacing.lg,
  },
  userTypeLabel: {
    ...typography.body,
    color: colors.gray[700],
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  segmentedButtons: {
    marginBottom: spacing.sm,
  },
  input: {
    marginBottom: spacing.md,
  },
  loginButton: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: 12,
  },
  loginButtonContent: {
    paddingVertical: spacing.sm,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  registerText: {
    ...typography.body,
    color: colors.gray[600],
  },
  registerButton: {
    marginLeft: spacing.xs,
  },
  demoContainer: {
    backgroundColor: colors.gray[50],
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  demoTitle: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  demoText: {
    ...typography.small,
    color: colors.gray[600],
    fontFamily: 'monospace',
  },
});