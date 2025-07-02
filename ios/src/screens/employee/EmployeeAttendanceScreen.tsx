import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Card, Button, Chip, Divider, FAB, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../contexts/LanguageContext';
import { ApiClient } from '../../services/ApiClient';
import { colors, spacing, typography } from '../../theme/theme';
import LoadingScreen from '../../components/LoadingScreen';

interface AttendanceRecord {
  id: number;
  date: string;
  check_in?: string;
  check_out?: string;
  total_hours: number;
  status: string;
  notes?: string;
  created_at: string;
}

export default function EmployeeAttendanceScreen() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { t, language } = useLanguage();

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      const data = await ApiClient.getMyAttendance();
      setAttendanceRecords(data || []);
    } catch (error: any) {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        language === 'es' 
          ? 'Error al cargar datos de asistencia' 
          : 'Error loading attendance data'
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAttendanceData();
    setRefreshing(false);
  };

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      await ApiClient.checkInOut('check_in');
      Alert.alert(
        language === 'es' ? 'Éxito' : 'Success',
        language === 'es' 
          ? '¡Nueva entrada registrada con éxito!' 
          : 'Check-in recorded successfully!'
      );
      await loadAttendanceData();
    } catch (error: any) {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        error.message
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      await ApiClient.checkInOut('check_out');
      Alert.alert(
        language === 'es' ? 'Éxito' : 'Success',
        language === 'es' 
          ? '¡Salida registrada con éxito!' 
          : 'Check-out recorded successfully!'
      );
      await loadAttendanceData();
    } catch (error: any) {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        error.message
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Get today's records and check for open check-ins
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = attendanceRecords.filter(record => record.date === today);
  const openCheckIn = todayRecords.find(record => record.check_in && !record.check_out);
  const hasOpenCheckIn = !!openCheckIn;
  const canCheckIn = !hasOpenCheckIn;

  // Calculate stats
  const totalHours = attendanceRecords.reduce((sum, record) => sum + (record.total_hours || 0), 0);
  const averageHours = attendanceRecords.length > 0 ? totalHours / attendanceRecords.length : 0;
  const presentDays = attendanceRecords.filter(record => record.status === 'present').length;

  if (loading) {
    return <LoadingScreen />;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present':
        return language === 'es' ? 'Presente' : 'Present';
      case 'absent':
        return language === 'es' ? 'Ausente' : 'Absent';
      case 'late':
        return language === 'es' ? 'Tarde' : 'Late';
      case 'half_day':
        return language === 'es' ? 'Medio Día' : 'Half Day';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return colors.success;
      case 'absent':
        return colors.error;
      case 'late':
        return colors.warning;
      case 'half_day':
        return colors.tertiary;
      default:
        return colors.gray[500];
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {language === 'es' ? 'Mi Asistencia' : 'My Attendance'}
          </Text>
          <Text style={styles.subtitle}>
            {language === 'es' 
              ? 'Controla tus horas de trabajo y registros de asistencia' 
              : 'Track your working hours and attendance records'}
          </Text>
        </View>

        {/* Today's Attendance Card */}
        <Card style={styles.todayCard}>
          <Card.Content>
            <View style={styles.todayHeader}>
              <Ionicons name="calendar" size={24} color={colors.primary} />
              <Text style={styles.todayTitle}>
                {language === 'es' ? 'Asistencia de Hoy' : "Today's Attendance"}
              </Text>
            </View>

            <Text style={styles.currentDate}>
              {new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>

            {/* Today's Records Summary */}
            {todayRecords.length > 0 && (
              <View style={styles.todayRecords}>
                <Text style={styles.todayRecordsTitle}>
                  {language === 'es' 
                    ? `Registros de Hoy (${todayRecords.length})` 
                    : `Today's Records (${todayRecords.length})`}
                </Text>
                {todayRecords.map((record, index) => (
                  <View key={record.id} style={styles.recordItem}>
                    <Text style={styles.recordLabel}>
                      {language === 'es' ? `Sesión ${index + 1}:` : `Session ${index + 1}:`}
                    </Text>
                    <View style={styles.recordTimes}>
                      {record.check_in && (
                        <Chip 
                          icon="login" 
                          style={[styles.timeChip, { backgroundColor: colors.success + '20' }]}
                          textStyle={{ color: colors.success }}
                        >
                          {record.check_in}
                        </Chip>
                      )}
                      {record.check_out ? (
                        <Chip 
                          icon="logout" 
                          style={[styles.timeChip, { backgroundColor: colors.error + '20' }]}
                          textStyle={{ color: colors.error }}
                        >
                          {record.check_out}
                        </Chip>
                      ) : (
                        <Chip 
                          icon="clock-outline" 
                          style={[styles.timeChip, { backgroundColor: colors.warning + '20' }]}
                          textStyle={{ color: colors.warning }}
                        >
                          {language === 'es' ? 'En curso' : 'In progress'}
                        </Chip>
                      )}
                      {record.total_hours > 0 && (
                        <Chip 
                          icon="timer-outline" 
                          style={[styles.timeChip, { backgroundColor: colors.primary + '20' }]}
                          textStyle={{ color: colors.primary }}
                        >
                          {record.total_hours.toFixed(2)}h
                        </Chip>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Check In/Out Buttons */}
            <View style={styles.actionButtons}>
              {canCheckIn ? (
                <Button
                  mode="contained"
                  onPress={handleCheckIn}
                  loading={actionLoading}
                  disabled={actionLoading}
                  icon="login"
                  style={[styles.actionButton, { backgroundColor: colors.success }]}
                >
                  {language === 'es' ? 'Marcar Entrada' : 'Check In'}
                </Button>
              ) : (
                <Button
                  mode="outlined"
                  onPress={handleCheckOut}
                  loading={actionLoading}
                  disabled={actionLoading}
                  icon="logout"
                  style={styles.actionButton}
                >
                  {language === 'es' ? 'Marcar Salida' : 'Check Out'}
                </Button>
              )}
            </View>

            {/* Today's Total */}
            {todayRecords.length > 0 && (
              <View style={styles.todayTotal}>
                <Text style={styles.todayTotalLabel}>
                  {language === 'es' ? 'Total de Horas Hoy:' : "Today's Total Hours:"}
                </Text>
                <Text style={styles.todayTotalValue}>
                  {todayRecords.reduce((sum, record) => sum + (record.total_hours || 0), 0).toFixed(2)}h
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="time" size={28} color={colors.primary} />
              <Text style={styles.statValue}>{totalHours.toFixed(1)}h</Text>
              <Text style={styles.statLabel}>
                {language === 'es' ? 'Horas Totales' : 'Total Hours'}
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="trending-up" size={28} color={colors.success} />
              <Text style={styles.statValue}>{averageHours.toFixed(1)}h</Text>
              <Text style={styles.statLabel}>
                {language === 'es' ? 'Promedio Diario' : 'Daily Average'}
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="calendar-outline" size={28} color={colors.tertiary} />
              <Text style={styles.statValue}>{presentDays}</Text>
              <Text style={styles.statLabel}>
                {language === 'es' ? 'Días Presentes' : 'Present Days'}
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Attendance History */}
        <Card style={styles.historyCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>
              {language === 'es' ? 'Historial de Asistencia' : 'Attendance History'}
            </Text>
            
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map((record) => (
                <View key={record.id} style={styles.historyItem}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyDate}>{formatDate(record.date)}</Text>
                    <Chip 
                      style={{ 
                        backgroundColor: getStatusColor(record.status) + '20',
                      }}
                      textStyle={{ color: getStatusColor(record.status) }}
                    >
                      {getStatusLabel(record.status)}
                    </Chip>
                  </View>
                  
                  <View style={styles.historyDetails}>
                    <View style={styles.historyTime}>
                      <Ionicons name="time-outline" size={16} color={colors.gray[600]} />
                      <Text style={styles.historyTimeText}>
                        {record.check_in || '--:--'} - {record.check_out || '--:--'}
                      </Text>
                    </View>
                    
                    {record.total_hours > 0 && (
                      <View style={styles.historyHours}>
                        <Ionicons name="hourglass-outline" size={16} color={colors.primary} />
                        <Text style={styles.historyHoursText}>
                          {record.total_hours.toFixed(2)}h
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  {record.notes && (
                    <Text style={styles.historyNotes}>{record.notes}</Text>
                  )}
                  
                  <Divider style={styles.divider} />
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color={colors.gray[300]} />
                <Text style={styles.emptyStateText}>
                  {language === 'es' 
                    ? 'No hay registros de asistencia' 
                    : 'No attendance records'}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* FAB for quick check-in/out */}
      <FAB
        icon={canCheckIn ? "login" : "logout"}
        style={[
          styles.fab,
          { backgroundColor: canCheckIn ? colors.success : colors.primary }
        ]}
        onPress={canCheckIn ? handleCheckIn : handleCheckOut}
        loading={actionLoading}
        disabled={actionLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray[600],
  },
  todayCard: {
    margin: spacing.lg,
    marginTop: 0,
    borderRadius: 16,
    elevation: 4,
  },
  todayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  todayTitle: {
    ...typography.h3,
    color: colors.gray[900],
    marginLeft: spacing.sm,
  },
  currentDate: {
    ...typography.body,
    color: colors.gray[600],
    marginBottom: spacing.md,
  },
  todayRecords: {
    backgroundColor: colors.gray[50],
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  todayRecordsTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: spacing.sm,
  },
  recordItem: {
    marginBottom: spacing.sm,
  },
  recordLabel: {
    ...typography.caption,
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  recordTimes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  timeChip: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  actionButtons: {
    marginVertical: spacing.md,
  },
  actionButton: {
    borderRadius: 8,
  },
  todayTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.success + '10',
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  todayTotalLabel: {
    ...typography.body,
    color: colors.success,
    fontWeight: '600',
  },
  todayTotalValue: {
    ...typography.h3,
    color: colors.success,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingTop: 0,
  },
  statCard: {
    width: '31%',
    borderRadius: 12,
  },
  statContent: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  statValue: {
    ...typography.h3,
    color: colors.gray[900],
    marginVertical: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.gray[600],
    textAlign: 'center',
  },
  historyCard: {
    margin: spacing.lg,
    marginTop: 0,
    borderRadius: 16,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  historyItem: {
    marginBottom: spacing.md,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  historyDate: {
    ...typography.body,
    fontWeight: '600',
    color: colors.gray[900],
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  historyTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTimeText: {
    ...typography.body,
    color: colors.gray[700],
    marginLeft: spacing.xs,
  },
  historyHours: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyHoursText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  historyNotes: {
    ...typography.caption,
    color: colors.gray[600],
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  divider: {
    marginTop: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.gray[500],
    marginTop: spacing.md,
  },
  fab: {
    position: 'absolute',
    margin: spacing.lg,
    right: 0,
    bottom: 0,
  },
});