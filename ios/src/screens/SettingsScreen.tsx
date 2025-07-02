import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { Card, Button, Divider, List, RadioButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { colors, spacing, typography } from '../theme/theme';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [leaveUpdates, setLeaveUpdates] = useState(true);
  const [payrollNotifications, setPayrollNotifications] = useState(true);
  
  const handleLogout = async () => {
    Alert.alert(
      language === 'es' ? 'Cerrar Sesión' : 'Sign Out',
      language === 'es' 
        ? '¿Estás seguro de que quieres cerrar sesión?' 
        : 'Are you sure you want to sign out?',
      [
        {
          text: language === 'es' ? 'Cancelar' : 'Cancel',
          style: 'cancel',
        },
        {
          text: language === 'es' ? 'Cerrar Sesión' : 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleLanguageChange = (newLanguage: 'en' | 'es') => {
    setLanguage(newLanguage);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Account Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>
            {language === 'es' ? 'Cuenta' : 'Account'}
          </Text>
          
          <View style={styles.userInfo}>
            <Ionicons name="person-circle-outline" size={60} color={colors.gray[700]} />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {user?.role === 'admin' ? 'Admin User' : 'Employee'}
              </Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <Chip style={styles.userRole}>
                {user?.role === 'admin' 
                  ? (language === 'es' ? 'Administrador' : 'Administrator')
                  : (language === 'es' ? 'Empleado' : 'Employee')
                }
              </Chip>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Language Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>
            {language === 'es' ? 'Idioma' : 'Language'}
          </Text>
          
          <RadioButton.Group 
            onValueChange={value => handleLanguageChange(value as 'en' | 'es')} 
            value={language}
          >
            <View style={styles.radioItem}>
              <View style={styles.radioLabel}>
                <Text style={styles.radioText}>English</Text>
                <Text style={styles.flagEmoji}>🇺🇸</Text>
              </View>
              <RadioButton value="en" color={colors.primary} />
            </View>
            
            <View style={styles.radioItem}>
              <View style={styles.radioLabel}>
                <Text style={styles.radioText}>Español</Text>
                <Text style={styles.flagEmoji}>🇪🇸</Text>
              </View>
              <RadioButton value="es" color={colors.primary} />
            </View>
          </RadioButton.Group>
        </Card.Content>
      </Card>

      {/* Notifications */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>
            {language === 'es' ? 'Notificaciones' : 'Notifications'}
          </Text>
          
          <View style={styles.switchItem}>
            <Text style={styles.switchLabel}>
              {language === 'es' ? 'Notificaciones' : 'Notifications'}
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.gray[300], true: colors.primary + '70' }}
              thumbColor={notificationsEnabled ? colors.primary : colors.gray[100]}
            />
          </View>
          
          {notificationsEnabled && (
            <>
              <Divider style={styles.divider} />
              
              <View style={styles.switchItem}>
                <Text style={styles.switchLabel}>
                  {language === 'es' ? 'Notificaciones por Correo' : 'Email Notifications'}
                </Text>
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                  trackColor={{ false: colors.gray[300], true: colors.primary + '70' }}
                  thumbColor={emailNotifications ? colors.primary : colors.gray[100]}
                />
              </View>
              
              <View style={styles.switchItem}>
                <Text style={styles.switchLabel}>
                  {language === 'es' ? 'Actualizaciones de Permisos' : 'Leave Updates'}
                </Text>
                <Switch
                  value={leaveUpdates}
                  onValueChange={setLeaveUpdates}
                  trackColor={{ false: colors.gray[300], true: colors.primary + '70' }}
                  thumbColor={leaveUpdates ? colors.primary : colors.gray[100]}
                />
              </View>
              
              <View style={styles.switchItem}>
                <Text style={styles.switchLabel}>
                  {language === 'es' ? 'Notificaciones de Nómina' : 'Payroll Notifications'}
                </Text>
                <Switch
                  value={payrollNotifications}
                  onValueChange={setPayrollNotifications}
                  trackColor={{ false: colors.gray[300], true: colors.primary + '70' }}
                  thumbColor={payrollNotifications ? colors.primary : colors.gray[100]}
                />
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      {/* About */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>
            {language === 'es' ? 'Acerca de' : 'About'}
          </Text>
          
          <List.Item
            title={language === 'es' ? 'Versión' : 'Version'}
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information-outline" />}
          />
          
          <List.Item
            title={language === 'es' ? 'Términos de Servicio' : 'Terms of Service'}
            left={props => <List.Icon {...props} icon="file-document-outline" />}
            onPress={() => {}}
          />
          
          <List.Item
            title={language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
            left={props => <List.Icon {...props} icon="shield-outline" />}
            onPress={() => {}}
          />
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        contentStyle={styles.logoutButtonContent}
        icon="logout"
      >
        {language === 'es' ? 'Cerrar Sesión' : 'Sign Out'}
      </Button>
    </ScrollView>
  );
}

const Chip = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <View style={[styles.chip, style]}>
    <Text style={styles.chipText}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  card: {
    margin: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: 16,
    elevation: 2,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: spacing.md,
    flex: 1,
  },
  userName: {
    ...typography.h3,
    color: colors.gray[900],
  },
  userEmail: {
    ...typography.body,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  userRole: {
    alignSelf: 'flex-start',
  },
  chip: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  chipText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  radioLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    ...typography.body,
    color: colors.gray[900],
  },
  flagEmoji: {
    ...typography.h3,
    marginLeft: spacing.sm,
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  switchLabel: {
    ...typography.body,
    color: colors.gray[900],
    flex: 1,
  },
  divider: {
    marginVertical: spacing.sm,
  },
  logoutButton: {
    margin: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
    backgroundColor: colors.error,
    borderRadius: 12,
  },
  logoutButtonContent: {
    paddingVertical: spacing.sm,
  },
});