import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialIcons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';

export default function HomeScreen({navigation}: any) {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, Carlos 👋</Text>
          <Text style={styles.date}>{currentDate}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialIcons name="notifications" size={24} color="#fff" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <MaterialIcons name="local-fire-department" size={24} color="#ff9500" />
            <Text style={styles.quickStatValue}>3</Text>
            <Text style={styles.quickStatLabel}>Dias Seq.</Text>
          </View>
          <View style={styles.quickStatItem}>
            <MaterialIcons name="fitness-center" size={24} color="#13ec5b" />
            <Text style={styles.quickStatValue}>45</Text>
            <Text style={styles.quickStatLabel}>Treinos</Text>
          </View>
          <View style={styles.quickStatItem}>
            <MaterialIcons name="timer" size={24} color="#007AFF" />
            <Text style={styles.quickStatValue}>18h</Text>
            <Text style={styles.quickStatLabel}>Total</Text>
          </View>
        </View>

        {/* Treino Atual Card */}
        <TouchableOpacity 
          style={styles.activeWorkoutCard}
          onPress={() => navigation.navigate('WorkoutActive')}>
          <LinearGradient
            colors={['#13ec5b', '#0eb545']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.activeWorkoutGradient}>
            <View style={styles.activeWorkoutHeader}>
              <View style={styles.pulseDot} />
              <Text style={styles.activeWorkoutLabel}>TREINO EM ANDAMENTO</Text>
            </View>
            <Text style={styles.activeWorkoutTitle}>Treino A - Peito e Tríceps</Text>
            <View style={styles.activeWorkoutInfo}>
              <View style={styles.activeWorkoutInfoItem}>
                <MaterialIcons name="timer" size={18} color="rgba(16,34,22,0.8)" />
                <Text style={styles.activeWorkoutInfoText}>12:45</Text>
              </View>
              <View style={styles.activeWorkoutInfoItem}>
                <MaterialIcons name="fitness-center" size={18} color="rgba(16,34,22,0.8)" />
                <Text style={styles.activeWorkoutInfoText}>3/8 exercícios</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, {backgroundColor: 'rgba(19,236,91,0.1)'}]}>
              <MaterialIcons name="play-arrow" size={28} color="#13ec5b" />
            </View>
            <Text style={styles.actionLabel}>Iniciar Treino</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Progress')}>
            <View style={[styles.actionIcon, {backgroundColor: 'rgba(0,122,255,0.1)'}]}>
              <MaterialIcons name="trending-up" size={28} color="#007AFF" />
            </View>
            <Text style={styles.actionLabel}>Progresso</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Plan')}>
            <View style={[styles.actionIcon, {backgroundColor: 'rgba(255,149,0,0.1)'}]}>
              <MaterialIcons name="card-membership" size={28} color="#ff9500" />
            </View>
            <Text style={styles.actionLabel}>Plano</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, {backgroundColor: 'rgba(175,82,222,0.1)'}]}>
              <MaterialIcons name="restaurant" size={28} color="#AF52DE" />
            </View>
            <Text style={styles.actionLabel}>Nutrição</Text>
          </TouchableOpacity>
        </View>

        {/* Próximos Treinos */}
        <Text style={styles.sectionTitle}>Próximos Treinos</Text>
        <View style={styles.upcomingWorkouts}>
          <View style={styles.upcomingCard}>
            <View style={styles.upcomingDate}>
              <Text style={styles.upcomingDay}>31</Text>
              <Text style={styles.upcomingMonth}>DEZ</Text>
            </View>
            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingTitle}>Treino B - Costas e Bíceps</Text>
              <Text style={styles.upcomingTime}>Amanhã • 07:00</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </View>

          <View style={styles.upcomingCard}>
            <View style={styles.upcomingDate}>
              <Text style={styles.upcomingDay}>01</Text>
              <Text style={styles.upcomingMonth}>JAN</Text>
            </View>
            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingTitle}>Treino C - Pernas</Text>
              <Text style={styles.upcomingTime}>Quarta • 07:00</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#92c9a4',
    textTransform: 'capitalize',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff3b30',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  quickStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickStatItem: {
    flex: 1,
    backgroundColor: '#1a3322',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  quickStatLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  activeWorkoutCard: {
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
  },
  activeWorkoutGradient: {
    padding: 20,
  },
  activeWorkoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#102216',
  },
  activeWorkoutLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#102216',
    letterSpacing: 1,
  },
  activeWorkoutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#102216',
    marginBottom: 16,
  },
  activeWorkoutInfo: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  activeWorkoutInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeWorkoutInfoText: {
    fontSize: 14,
    color: 'rgba(16,34,22,0.8)',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(16,34,22,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    width: '38%',
    height: '100%',
    backgroundColor: '#102216',
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 12,
    color: '#92c9a4',
    textAlign: 'center',
  },
  upcomingWorkouts: {
    gap: 12,
  },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a3322',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  upcomingDate: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(19,236,91,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#13ec5b',
  },
  upcomingMonth: {
    fontSize: 10,
    color: '#13ec5b',
    fontWeight: '600',
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  upcomingTime: {
    fontSize: 13,
    color: '#666',
  },
});
