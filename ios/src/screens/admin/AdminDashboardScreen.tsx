import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { Card, Button, Chip, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ApiClient } from '../../services/ApiClient';
import { colors, spacing, typography } from '../../theme/theme';
import LoadingScreen from '../../components/LoadingScreen';

interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  pendingLeaves: number;
  monthlyPayroll: number;
  attendanceTrends: Array<{
    date: string;
    present: number;
    absent: number;
    late: number;
  }>;
  departmentStats: Array<{
    department: string;
    count: number;
  }>;
}

const screenWidth = Dimensions.get('window').width - 40;

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuth();
  const { t, language } = useLanguage();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await ApiClient.getDashboardStats();
      setStats(data);
    } catch (error: any) {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        language === 'es' 
          ? 'Error al cargar estadísticas del panel' 
          : 'Failed to load dashboard stats'
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardStats();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!stats) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={styles.errorText}>
          {language === 'es' 
            ? 'Error al cargar datos del panel' 
            : 'Failed to load dashboard data'}
        </Text>
        <Button 
          mode="contained" 
          onPress={loadDashboardStats}
          style={styles.retryButton}
        >
          {language === 'es' ? 'Reintentar' : 'Retry'}
        </Button>
      </View>
    );
  }

  const attendanceRate = stats.totalEmployees > 0 
    ? Math.round((stats.presentToday / stats.totalEmployees) * 100) 
    : 0;

  // Prepare chart data
  const attendanceData = {
    labels: stats.attendanceTrends.map(item => item.date.substring(5)),
    datasets: [
      {
        data: stats.attendanceTrends.map(item => item.present),
        color: () => colors.success,
        strokeWidth: 2,
      },
      {
        data: stats.attendanceTrends.map(item => item.absent),
        color: () => colors.error,
        strokeWidth: 2,
      },
    ],
    legend: [language === 'es' ? 'Presentes' : 'Present', language === 'es' ? 'Ausentes' : 'Absent'],
  };

  const departmentData = {
    labels: stats.departmentStats.map(item => item.department),
    datasets: [
      {
        data: stats.departmentStats.map(item => item.count),
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'es' ? 'Panel de Control' : 'Dashboard'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'es' 
            ? 'Resumen de la actividad de la empresa' 
            : 'Company activity overview'}
        </Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsContainer}>
        <Card style={styles.metricCard}>
          <Card.Content style={styles.metricContent}>
            <Ionicons name="people" size={28} color={colors.primary} />
            <Text style={styles.metricValue}>{stats.totalEmployees}</Text>
            <Text style={styles.metricLabel}>
              {language === 'es' ? 'Empleados' : 'Employees'}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.metricCard}>
          <Card.Content style={styles.metricContent}>
            <Ionicons name="checkmark-circle" size={28} color={colors.success} />
            <Text style={styles.metricValue}>{stats.presentToday}</Text>
            <Text style={styles.metricLabel}>
              {language === 'es' ? 'Presentes Hoy' : 'Present Today'}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.metricCard}>
          <Card.Content style={styles.metricContent}>
            <Ionicons name="calendar" size={28} color={colors.warning} />
            <Text style={styles.metricValue}>{stats.pendingLeaves}</Text>
            <Text style={styles.metricLabel}>
              {language === 'es' ? 'Permisos Pendientes' : 'Pending Leaves'}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.metricCard}>
          <Card.Content style={styles.metricContent}>
            <Ionicons name="cash" size={28} color={colors.tertiary} />
            <Text style={styles.metricValue}>
              ${stats.monthlyPayroll.toLocaleString()}
            </Text>
            <Text style={styles.metricLabel}>
              {language === 'es' ? 'Nómina Mensual' : 'Monthly Payroll'}
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Attendance Chart */}
      <Card style={styles.chartCard}>
        <Card.Content>
          <Text style={styles.chartTitle}>
            {language === 'es' ? 'Tendencia de Asistencia' : 'Attendance Trend'}
          </Text>
          <Text style={styles.chartSubtitle}>
            {language === 'es' 
              ? 'Últimos 7 días' 
              : 'Last 7 days'}
          </Text>
          
          {stats.attendanceTrends.length > 0 ? (
            <LineChart
              data={attendanceData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                {language === 'es' 
                  ? 'No hay datos disponibles' 
                  : 'No data available'}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Department Distribution */}
      <Card style={styles.chartCard}>
        <Card.Content>
          <Text style={styles.chartTitle}>
            {language === 'es' ? 'Distribución por Departamento' : 'Department Distribution'}
          </Text>
          <Text style={styles.chartSubtitle}>
            {language === 'es' 
              ? 'Empleados por departamento' 
              : 'Employees by department'}
          </Text>
          
          {stats.departmentStats.length > 0 ? (
            <BarChart
              data={departmentData}
              width={screenWidth}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
              }}
              style={styles.chart}
              verticalLabelRotation={30}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                {language === 'es' 
                  ? 'No hay datos disponibles' 
                  : 'No data available'}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>
            {language === 'es' ? 'Acciones Rápidas' : 'Quick Actions'}
          </Text>
          <View style={styles.actionButtons}>
            <Button
              mode="contained-tonal"
              icon="account-plus"
              style={styles.actionButton}
            >
              {language === 'es' ? 'Nuevo Empleado' : 'New Employee'}
            </Button>
            <Button
              mode="contained-tonal"
              icon="calendar-check"
              style={styles.actionButton}
            >
              {language === 'es' ? 'Aprobar Permisos' : 'Approve Leaves'}
            </Button>
            <Button
              mode="contained-tonal"
              icon="cash-multiple"
              style={styles.actionButton}
            >
              {language === 'es' ? 'Procesar Nómina' : 'Process Payroll'}
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
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
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingTop: 0,
  },
  metricCard: {
    width: '48%',
    marginBottom: spacing.md,
    borderRadius: 12,
  },
  metricContent: {
    alignItems: 'center',
    padding: spacing.md,
  },
  metricValue: {
    ...typography.h2,
    color: colors.gray[900],
    marginVertical: spacing.xs,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.gray[600],
    textAlign: 'center',
  },
  chartCard: {
    margin: spacing.lg,
    marginTop: 0,
    borderRadius: 16,
  },
  chartTitle: {
    ...typography.h3,
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  chartSubtitle: {
    ...typography.caption,
    color: colors.gray[600],
    marginBottom: spacing.md,
  },
  chart: {
    borderRadius: 16,
    marginVertical: spacing.md,
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    ...typography.body,
    color: colors.gray[500],
  },
  actionsCard: {
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
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    marginBottom: spacing.md,
    borderRadius: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.body,
    color: colors.gray[700],
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
  retryButton: {
    borderRadius: 8,
  },
});