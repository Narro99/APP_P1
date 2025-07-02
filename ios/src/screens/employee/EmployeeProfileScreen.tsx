import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Card, Button, TextInput, Avatar, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ApiClient } from '../../services/ApiClient';
import { colors, spacing, typography } from '../../theme/theme';
import LoadingScreen from '../../components/LoadingScreen';

interface EmployeeProfile {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  start_date: string;
  location?: string;
  status: string;
  role: string;
}

export default function EmployeeProfileScreen() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
  });

  const { user } = useAuth();
  const { t, language } = useLanguage();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await ApiClient.getMyProfile();
      setProfile(data);
      setFormData({
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone || '',
        location: data.location || '',
      });
    } catch (error: any) {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        language === 'es' 
          ? 'Error al cargar perfil' 
          : 'Error loading profile'
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await ApiClient.updateMyProfile(formData);
      await loadProfile();
      setEditing(false);
      Alert.alert(
        language === 'es' ? 'Éxito' : 'Success',
        language === 'es' 
          ? '¡Perfil actualizado con éxito!' 
          : 'Profile updated successfully!'
      );
    } catch (error: any) {
      Alert.alert(
        language === 'es' ? 'Error' : 'Error',
        error.message || (language === 'es' 
          ? 'Error al actualizar perfil' 
          : 'Error updating profile')
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone || '',
        location: profile.location || '',
      });
    }
    setEditing(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={styles.errorText}>
          {language === 'es' 
            ? 'Perfil no encontrado' 
            : 'Profile not found'}
        </Text>
        <Button 
          mode="contained" 
          onPress={loadProfile}
          style={styles.retryButton}
        >
          {language === 'es' ? 'Reintentar' : 'Retry'}
        </Button>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
          {language === 'es' ? 'Mi Perfil' : 'My Profile'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'es' 
            ? 'Ver y actualizar tu información personal' 
            : 'View and update your personal information'}
        </Text>
      </View>

      {/* Profile Overview */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <View style={styles.avatarContainer}>
            <Avatar.Text
              size={80}
              label={`${profile.first_name[0]}${profile.last_name[0]}`}
              style={styles.avatar}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.name}>
                {profile.first_name} {profile.last_name}
              </Text>
              <Text style={styles.position}>{profile.position}</Text>
              <View style={styles.badgeContainer}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{profile.employee_id}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <InfoItem
              icon="business-outline"
              label={language === 'es' ? 'Departamento' : 'Department'}
              value={profile.department}
            />
            <InfoItem
              icon="calendar-outline"
              label={language === 'es' ? 'Fecha de Inicio' : 'Start Date'}
              value={formatDate(profile.start_date)}
            />
            <InfoItem
              icon="person-outline"
              label={language === 'es' ? 'Estado' : 'Status'}
              value={profile.status === 'active' 
                ? (language === 'es' ? 'Activo' : 'Active')
                : (language === 'es' ? 'Inactivo' : 'Inactive')
              }
              valueStyle={{ 
                color: profile.status === 'active' ? colors.success : colors.error 
              }}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Personal Information */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              {language === 'es' ? 'Información Personal' : 'Personal Information'}
            </Text>
            {!editing ? (
              <Button
                mode="text"
                onPress={() => setEditing(true)}
                icon="pencil"
              >
                {language === 'es' ? 'Editar' : 'Edit'}
              </Button>
            ) : (
              <View style={styles.editButtons}>
                <Button
                  mode="text"
                  onPress={handleCancel}
                  textColor={colors.error}
                >
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </Button>
                <Button
                  mode="text"
                  onPress={handleSave}
                  loading={saving}
                  disabled={saving}
                >
                  {language === 'es' ? 'Guardar' : 'Save'}
                </Button>
              </View>
            )}
          </View>

          {editing ? (
            <View style={styles.form}>
              <TextInput
                label={language === 'es' ? 'Nombre' : 'First Name'}
                value={formData.firstName}
                onChangeText={(text) => setFormData({...formData, firstName: text})}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label={language === 'es' ? 'Apellido' : 'Last Name'}
                value={formData.lastName}
                onChangeText={(text) => setFormData({...formData, lastName: text})}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label={language === 'es' ? 'Teléfono' : 'Phone'}
                value={formData.phone}
                onChangeText={(text) => setFormData({...formData, phone: text})}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
              />
              <TextInput
                label={language === 'es' ? 'Ubicación' : 'Location'}
                value={formData.location}
                onChangeText={(text) => setFormData({...formData, location: text})}
                mode="outlined"
                style={styles.input}
              />
            </View>
          ) : (
            <View style={styles.infoList}>
              <InfoItem
                icon="person-outline"
                label={language === 'es' ? 'Nombre' : 'First Name'}
                value={profile.first_name}
              />
              <InfoItem
                icon="person-outline"
                label={language === 'es' ? 'Apellido' : 'Last Name'}
                value={profile.last_name}
              />
              <InfoItem
                icon="mail-outline"
                label={language === 'es' ? 'Correo' : 'Email'}
                value={profile.email}
                readonly
              />
              <InfoItem
                icon="call-outline"
                label={language === 'es' ? 'Teléfono' : 'Phone'}
                value={profile.phone || (language === 'es' ? 'No proporcionado' : 'Not provided')}
                valueStyle={!profile.phone ? { fontStyle: 'italic', color: colors.gray[500] } : {}}
              />
              <InfoItem
                icon="location-outline"
                label={language === 'es' ? 'Ubicación' : 'Location'}
                value={profile.location || (language === 'es' ? 'No proporcionada' : 'Not provided')}
                valueStyle={!profile.location ? { fontStyle: 'italic', color: colors.gray[500] } : {}}
              />
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Employment Details */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>
            {language === 'es' ? 'Detalles de Empleo' : 'Employment Details'}
          </Text>
          
          <View style={styles.infoList}>
            <InfoItem
              icon="business-outline"
              label={language === 'es' ? 'Departamento' : 'Department'}
              value={profile.department}
              readonly
            />
            <InfoItem
              icon="briefcase-outline"
              label={language === 'es' ? 'Cargo' : 'Position'}
              value={profile.position}
              readonly
            />
            <InfoItem
              icon="calendar-outline"
              label={language === 'es' ? 'Fecha de Inicio' : 'Start Date'}
              value={formatDate(profile.start_date)}
              readonly
            />
            <InfoItem
              icon="id-card-outline"
              label={language === 'es' ? 'ID de Empleado' : 'Employee ID'}
              value={profile.employee_id}
              readonly
            />
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

interface InfoItemProps {
  icon: string;
  label: string;
  value: string;
  readonly?: boolean;
  valueStyle?: any;
}

const InfoItem = ({ icon, label, value, readonly, valueStyle }: InfoItemProps) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon as any} size={20} color={colors.gray[600]} />
    <View style={styles.infoItemContent}>
      <Text style={styles.infoItemLabel}>{label}</Text>
      <Text style={[styles.infoItemValue, valueStyle]}>
        {value}
        {readonly && <Text style={styles.readonlyTag}> (Solo lectura)</Text>}
      </Text>
    </View>
  </View>
);

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
  profileCard: {
    margin: spacing.lg,
    marginTop: 0,
    borderRadius: 16,
    elevation: 4,
  },
  profileContent: {
    padding: spacing.lg,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    backgroundColor: colors.primary,
  },
  nameContainer: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  name: {
    ...typography.h2,
    color: colors.gray[900],
  },
  position: {
    ...typography.body,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 16,
  },
  badgeText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: spacing.md,
  },
  infoCard: {
    margin: spacing.lg,
    marginTop: 0,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.gray[900],
  },
  editButtons: {
    flexDirection: 'row',
  },
  form: {
    gap: spacing.md,
  },
  input: {
    backgroundColor: colors.white,
  },
  infoList: {
    gap: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoItemContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  infoItemLabel: {
    ...typography.caption,
    color: colors.gray[600],
    marginBottom: spacing.xs / 2,
  },
  infoItemValue: {
    ...typography.body,
    color: colors.gray[900],
  },
  readonlyTag: {
    ...typography.caption,
    color: colors.gray[500],
    fontStyle: 'italic',
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