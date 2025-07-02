import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Card, Button, Avatar, Chip, ProgressBar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ApiClient } from '../../services/ApiClient';
import { colors, spacing, typography } from '../../theme/theme';
import LoadingScreen from '../../components/LoadingScreen';

interface EmployeeStats {
  attendanceToday: boolean;
  totalHoursToday: number;
  weeklyHours: number;
  monthlyAttendance: number;
  pendingLeaves: number;
  approvedLeaves: number;
  remainingLeaves: number;
}

interface EmployeeProfile {
  first_name: string;
  last_name: string;
  department: string;
  position: string;
  start_date: string;
  location?: string;
}

export default function EmployeeDashboardScreen() {
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  const { user } = useAuth();
  const { t, language } = useLanguage();

  useEffect(() => {
    loadEmployeeData();
  }, []);

  const loadEmployeeData = async () => {
    try {
      const [statsData, profileData] = await Promise.all([
        ApiClient.getMyStats(),
        ApiClient.getMyProfile(),
      ]);

      setStats(statsData);
      setProfile(profileData);
    } catch (error: any) {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        language === 'es' ? 'Error al cargar datos' : 'Error loading data'
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEmployeeData();
    setRefreshing(false);
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      await ApiClient.checkInOut('check_in');
      Alert.alert(
        language === 'es' ? 'Éxito' : 'Success',
        language === 'es' ? '¡Entrada registrada con éxito!' : 'Check-in recorded successfully!'
      );
      await loadEmployeeData();
    } catch (error: any) {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        error.message
      );
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setCheckingIn(true);
    try {
      await ApiClient.checkInOut('check_out');
      Alert.alert(
        language === 'es' ? 'Éxito' : 'Success',
        language === 'es' ? '¡Salida registrada con éxito!' : 'Check-out recorded successfully!'
      );
      await loadEmployeeData();
    } catch (error: any) {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        error.message
      );
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const currentTime = new Date().toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const currentDate = new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={['#10b981', '#059669']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Avatar.Text
              size={60}
              label={profile ? `${profile.first_name[0]}${profile.last_name[0]}` : 'E'}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.welcomeText}>
                {language === 'es' ? '¡Bienvenido de nuevo!' : 'Welcome back!'}
              </Text>
              <Text style={styles.userName}>
                {profile ? profile.first_name : 'Empleado'}
              </Text>
              <Text style={styles.currentTime}>{currentTime}</Text>
            </View>
          </View>
          <Text style={styles.currentDate}>{currentDate}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Check In/Out Card */}
        <Card style={styles.checkInCard}>
          <Card.Content style={styles.checkInContent}>
            <View style={styles.checkInHeader}>
              <Ionicons name="time-outline" size={24} color={colors.primary} />
              <Text style={styles.checkInTitle}>
                {language === 'es' ? 'Control de Asistencia' : 'Attendance Control'}
              </Text>
            </View>
            
            <View style={styles.checkInActions}>
              <Button
                mode="contained"
                onPress={handleCheckIn}
                loading={checkingIn}
                disabled={checkingIn}
                style={[styles.checkInButton, { backgroundColor: colors.success }]}
                icon="login"
              >
                {language === 'es' ? 'Marcar Entrada' : 'Check In'}
              </Button>
              
              <Button
                mode="outlined"
                onPress={handleCheckOut}
                loading={checkingIn}
                disabled={checkingIn}
                style={styles.checkOutButton}
                icon="logout"
              >
                {language === 'es' ? 'Marcar Salida' : 'Check Out'}
              </Button>
            </View>

            {stats && stats.totalHoursToday > 0 && (
              <View style={styles.todayHours}>
                <Text style={styles.todayHoursLabel}>
                  {language === 'es' ? 'Horas de Hoy:' : "Today's Hours:"}
                </Text>
                <Text style={styles.todayHoursValue}>
                  {stats.totalHoursToday.toFixed(1)}h
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="time" size={32} color={colors.primary} />
              <Text style={styles.statValue}>
                {stats?.weeklyHours.toFixed(1) || '0.0'}h
              </Text>
              <Text style={styles.statLabel}>
                {language === 'es' ? 'Esta Semana' : 'This Week'}
              </Text>
              <ProgressBar
                progress={(stats?.weeklyHours || 0) / 40}
                color={colors.primary}
                style={styles.progressBar}
              />
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="calendar" size={32} color={colors.success} />
              <Text style={styles.statValue}>
                {stats?.monthlyAttendance || 0}%
              </Text>
              <Text style={styles.statLabel}>
                {language === 'es' ? 'Asistencia' : 'Attendance'}
              </Text>
              <ProgressBar
                progress={(stats?.monthlyAttendance || 0) / 100}
                color={colors.success}
                style={styles.progressBar}
              />
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="calendar-outline" size={32} color={colors.warning} />
              <Text style={styles.statValue}>
                {stats?.remainingLeaves || 0}
              </Text>
              <Text style={styles.statLabel}>
                {language === 'es' ? 'Días Restantes' : 'Days Left'}
              </Text>
              <ProgressBar
                progress={(stats?.remainingLeaves || 0) / 20}
                color={colors.warning}
                style={styles.progressBar}
              />
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="checkmark-circle" size={32} color={colors.tertiary} />
              <Text style={styles.statValue}>
                {stats?.pendingLeaves || 0}
              </Text>
              <Text style={styles.statLabel}>
                {language === 'es' ? 'Pendientes' : 'Pending'}
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>
              {language === 'es' ? 'Acciones Rápidas' : 'Quick Actions'}
            </Text>
            <View style={styles.quickActions}>
              <Button
                mode="contained-tonal"
                icon="calendar-plus"
                style={styles.quickActionButton}
              >
                {language === 'es' ? 'Solicitar Permiso' : 'Request Leave'}
              </Button>
              <Button
                mode="contained-tonal"
                icon="chart-line"
                style={styles.quickActionButton}
              >
                {language === 'es' ? 'Ver Horario' : 'View Schedule'}
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Profile Summary */}
        {profile && (
          <Card style={styles.profileCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>
                {language === 'es' ? 'Mi Información' : 'My Information'}
              </Text>
              <View style={styles.profileInfo}>
                <View style={styles.profileItem}>
                  <Ionicons name="business-outline" size={20} color={colors.gray[600]} />
                  <Text style={styles.profileLabel}>
                    {language === 'es' ? 'Departamento:' : 'Department:'}
                  </Text>
                  <Text style={styles.profileValue}>{profile.department}</Text>
                </View>
                <View style={styles.profileItem}>
                  <Ionicons name="briefcase-outline" size={20} color={colors.gray[600]} />
                  <Text style={styles.profileLabel}>
                    {language === 'es' ? 'Cargo:' : 'Position:'}
                  </Text>
                  <Text style={styles.profileValue}>{profile.position}</Text>
                </View>
                {profile.location && (
                  <View style={styles.profileItem}>
                    <Ionicons name="location-outline" size={20} color={colors.gray[600]} />
                    <Text style={styles.profileLabel}>
                      {language === 'es' ? 'Ubicación:' : 'Location:'}
                    </Text>
                    <Text style={styles.profileValue}>{profile.location}</Text>
                  </View>
                )}
              </View>
            </Card.Content>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    paddingTop: 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    marginRight: spacing.md,
    backgroundColor: colors.white,
  },
  userDetails: {
    flex: 1,
  },
  welcomeText: {
    ...typography.body,
    color: colors.white,
    opacity: 0.9,
  },
  userName: {
    ...typography.h2,
    color: colors.white,
    marginVertical: spacing.xs,
  },
  currentTime: {
    ...typography.h3,
    color: colors.white,
    fontFamily: 'monospace',
  },
  currentDate: {
    ...typography.body,
    color: colors.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    padding: spacing.lg,
    paddingTop: -spacing.lg,
  },
  checkInCard: {
    marginBottom: spacing.lg,
    borderRadius: 16,
    elevation: 4,
  },
  checkInContent: {
    padding: spacing.lg,
  },
  checkInHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  checkInTitle: {
    ...typography.h3,
    marginLeft: spacing.sm,
    color: colors.gray[900],
  },
  checkInActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  checkInButton: {
    flex: 1,
    marginRight: spacing.sm,
    borderRadius: 12,
  },
  checkOutButton: {
    flex: 1,
    marginLeft: spacing.sm,
    borderRadius: 12,
  },
  todayHours: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  todayHoursLabel: {
    ...typography.body,
    color: colors.gray[600],
  },
  todayHoursValue: {
    ...typography.h3,
    color: colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '48%',
    marginBottom: spacing.md,
    borderRadius: 12,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    padding: spacing.md,
  },
  statValue: {
    ...typography.h2,
    color: colors.gray[900],
    marginVertical: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  progressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
  },
  quickActionsCard: {
    marginBottom: spacing.lg,
    borderRadius: 16,
    elevation: 2,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
    borderRadius: 12,
  },
  profileCard: {
    borderRadius: 16,
    elevation: 2,
  },
  profileInfo: {
    gap: spacing.md,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileLabel: {
    ...typography.body,
    color: colors.gray[600],
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  profileValue: {
    ...typography.body,
    color: colors.gray[900],
    fontWeight: '600',
    flex: 1,
  },
});