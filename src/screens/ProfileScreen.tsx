import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialIcons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {useAuth} from '../contexts/AuthContext';

export default function ProfileScreen({navigation}: any) {
  const {user, aluno, logout} = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          },
        },
      ],
    );
  };

  // Pegar iniciais do nome para o avatar
  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <MaterialIcons name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {/* Profile Picture */}
          <TouchableOpacity style={styles.profileImageContainer}>
            <LinearGradient
              colors={['rgba(19,236,91,0.2)', 'rgba(19,236,91,0.05)']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.profileImageBorder}>
              {user?.avatar ? (
                <Image
                  source={{uri: user.avatar}}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitials}>{getInitials(aluno?.nome || user?.name)}</Text>
                </View>
              )}
            </LinearGradient>
            <View style={styles.editBadge}>
              <MaterialIcons name="edit" size={14} color="#102216" />
            </View>
          </TouchableOpacity>

          {/* Profile Info */}
          <Text style={styles.profileName}>{aluno?.nome || user?.name || 'Usuário'}</Text>
          <View style={styles.memberBadge}>
            <MaterialIcons name="workspace-premium" size={16} color="#13ec5b" />
            <Text style={styles.memberBadgeText}>Membro {aluno?.status === 'ativo' ? 'Ativo' : 'Gold'}</Text>
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity style={styles.editProfileButton}>
            <MaterialIcons name="edit" size={20} color="#102216" />
            <Text style={styles.editProfileButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {/* Stat 1 - Treinos */}
          <View style={styles.statCard}>
            <View style={[styles.statIcon, {backgroundColor: 'rgba(19,236,91,0.1)'}]}>
              <MaterialIcons name="fitness-center" size={24} color="#13ec5b" />
            </View>
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>TREINOS</Text>
          </View>

          {/* Stat 2 - Dias Sequenciais */}
          <View style={styles.statCard}>
            <View style={styles.fireIconBadge}>
              <MaterialIcons name="local-fire-department" size={12} color="#ff9500" />
            </View>
            <View style={[styles.statIcon, {backgroundColor: 'rgba(255,149,0,0.1)'}]}>
              <MaterialIcons name="calendar-today" size={24} color="#ff9500" />
            </View>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>DIAS SEQ.</Text>
          </View>

          {/* Stat 3 - Peso */}
          <View style={styles.statCard}>
            <View style={[styles.statIcon, {backgroundColor: 'rgba(0,122,255,0.1)'}]}>
              <MaterialIcons name="monitor-weight" size={24} color="#007AFF" />
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>82</Text>
              <Text style={styles.statUnit}>kg</Text>
            </View>
            <Text style={styles.statLabel}>PESO</Text>
          </View>
        </View>

        {/* Settings Groups */}
        <View style={styles.settingsContainer}>
          {/* Section: Conta */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CONTA</Text>
            <View style={styles.settingsGroup}>
              <TouchableOpacity style={[styles.settingItem, styles.settingItemBorder]}>
                <View style={[styles.settingIcon, {backgroundColor: 'rgba(19,236,91,0.1)'}]}>
                  <MaterialIcons name="person" size={24} color="#13ec5b" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Dados Pessoais</Text>
                  <Text style={styles.settingSubtitle}>Nome, E-mail, Telefone</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.settingItem, styles.settingItemBorder]}>
                <View style={[styles.settingIcon, {backgroundColor: 'rgba(0,122,255,0.1)'}]}>
                  <MaterialIcons name="credit-card" size={24} color="#007AFF" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Plano & Assinatura</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={[styles.settingIcon, {backgroundColor: 'rgba(175,82,222,0.1)'}]}>
                  <MaterialIcons name="lock" size={24} color="#AF52DE" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Segurança</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Section: Preferências */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PREFERÊNCIAS</Text>
            <View style={styles.settingsGroup}>
              <View style={[styles.settingItem, styles.settingItemBorder]}>
                <View style={[styles.settingIcon, {backgroundColor: 'rgba(255,149,0,0.1)'}]}>
                  <MaterialIcons name="notifications" size={24} color="#ff9500" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Notificações</Text>
                  <Text style={styles.settingSubtitle}>Lembretes de treino</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{false: '#3e3e3e', true: '#13ec5b'}}
                  thumbColor="#fff"
                />
              </View>

              <TouchableOpacity style={[styles.settingItem, styles.settingItemBorder]}>
                <View style={[styles.settingIcon, {backgroundColor: 'rgba(142,142,147,0.1)'}]}>
                  <MaterialIcons name="dark-mode" size={24} color="#8E8E93" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Tema</Text>
                  <Text style={styles.settingSubtitle}>Automático (Sistema)</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={[styles.settingIcon, {backgroundColor: 'rgba(48,176,199,0.1)'}]}>
                  <MaterialIcons name="straighten" size={24} color="#30B0C7" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Unidades</Text>
                  <Text style={styles.settingSubtitle}>Métrico (kg, cm)</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Section: Outros */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OUTROS</Text>
            <View style={styles.settingsGroup}>
              <TouchableOpacity style={[styles.settingItem, styles.settingItemBorder]}>
                <View style={[styles.settingIcon, {backgroundColor: 'rgba(52,199,89,0.1)'}]}>
                  <MaterialIcons name="help" size={24} color="#34C759" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Ajuda & Suporte</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
                <View style={[styles.settingIcon, {backgroundColor: 'rgba(255,59,48,0.1)'}]}>
                  <MaterialIcons name="logout" size={24} color="#FF3B30" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, {color: '#FF3B30'}]}>Sair da Conta</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* App Version */}
            <View style={styles.versionContainer}>
              <Text style={styles.versionText}>Versão 2.4.0 (Build 302)</Text>
              <Text style={styles.versionText}>© 2024 Iron Gym App</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#102216',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(16,34,22,0.95)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 16,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImageBorder: {
    width: 128,
    height: 128,
    borderRadius: 64,
    padding: 4,
    borderWidth: 2,
    borderColor: '#13ec5b',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: '#13ec5b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#102216',
  },
  editBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#13ec5b',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#102216',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(26,51,34,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  memberBadgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#13ec5b',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#13ec5b',
    width: '100%',
    height: 48,
    borderRadius: 12,
    marginTop: 8,
  },
  editProfileButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#102216',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a3322',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    position: 'relative',
  },
  fireIconBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statUnit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    letterSpacing: 0.5,
  },
  settingsContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  settingsGroup: {
    backgroundColor: '#1a3322',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 24,
    gap: 4,
  },
  versionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
