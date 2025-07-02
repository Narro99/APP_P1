import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

// Employee Screens
import EmployeeDashboardScreen from '../screens/employee/EmployeeDashboardScreen';
import EmployeeAttendanceScreen from '../screens/employee/EmployeeAttendanceScreen';
import EmployeeLeavesScreen from '../screens/employee/EmployeeLeavesScreen';
import EmployeeProfileScreen from '../screens/employee/EmployeeProfileScreen';
import EmployeePayslipsScreen from '../screens/employee/EmployeePayslipsScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminEmployeesScreen from '../screens/admin/AdminEmployeesScreen';
import AdminAttendanceScreen from '../screens/admin/AdminAttendanceScreen';
import AdminLeavesScreen from '../screens/admin/AdminLeavesScreen';
import AdminPayrollScreen from '../screens/admin/AdminPayrollScreen';

// Settings
import SettingsScreen from '../screens/SettingsScreen';

export type EmployeeTabParamList = {
  Dashboard: undefined;
  Attendance: undefined;
  Leaves: undefined;
  Payslips: undefined;
  Profile: undefined;
};

export type AdminTabParamList = {
  Dashboard: undefined;
  Employees: undefined;
  Attendance: undefined;
  Leaves: undefined;
  Payroll: undefined;
};

export type RootStackParamList = {
  Main: undefined;
  Settings: undefined;
};

const EmployeeTab = createBottomTabNavigator<EmployeeTabParamList>();
const AdminTab = createBottomTabNavigator<AdminTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

function EmployeeTabNavigator() {
  const { t } = useLanguage();

  return (
    <EmployeeTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Attendance') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Leaves') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Payslips') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <EmployeeTab.Screen 
        name="Dashboard" 
        component={EmployeeDashboardScreen}
        options={{ tabBarLabel: t('dashboard') }}
      />
      <EmployeeTab.Screen 
        name="Attendance" 
        component={EmployeeAttendanceScreen}
        options={{ tabBarLabel: t('myAttendance') }}
      />
      <EmployeeTab.Screen 
        name="Leaves" 
        component={EmployeeLeavesScreen}
        options={{ tabBarLabel: t('myLeaves') }}
      />
      <EmployeeTab.Screen 
        name="Payslips" 
        component={EmployeePayslipsScreen}
        options={{ tabBarLabel: t('myPayslips') }}
      />
      <EmployeeTab.Screen 
        name="Profile" 
        component={EmployeeProfileScreen}
        options={{ tabBarLabel: t('myProfile') }}
      />
    </EmployeeTab.Navigator>
  );
}

function AdminTabNavigator() {
  const { t } = useLanguage();

  return (
    <AdminTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Employees') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Attendance') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Leaves') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Payroll') {
            iconName = focused ? 'card' : 'card-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <AdminTab.Screen 
        name="Dashboard" 
        component={AdminDashboardScreen}
        options={{ tabBarLabel: t('dashboard') }}
      />
      <AdminTab.Screen 
        name="Employees" 
        component={AdminEmployeesScreen}
        options={{ tabBarLabel: t('employees') }}
      />
      <AdminTab.Screen 
        name="Attendance" 
        component={AdminAttendanceScreen}
        options={{ tabBarLabel: t('attendance') }}
      />
      <AdminTab.Screen 
        name="Leaves" 
        component={AdminLeavesScreen}
        options={{ tabBarLabel: t('leaves') }}
      />
      <AdminTab.Screen 
        name="Payroll" 
        component={AdminPayrollScreen}
        options={{ tabBarLabel: t('payroll') }}
      />
    </AdminTab.Navigator>
  );
}

function MainNavigator() {
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin' || user?.role === 'hr_manager';
  
  return isAdmin ? <AdminTabNavigator /> : <EmployeeTabNavigator />;
}

export default function AppNavigator() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen 
        name="Main" 
        component={MainNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ 
          title: 'Configuración',
          headerBackTitle: 'Atrás'
        }}
      />
    </RootStack.Navigator>
  );
}