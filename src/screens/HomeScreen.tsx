import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialIcons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {useAuth} from '../contexts/AuthContext';
import {treinoService, Treino} from '../services/treino';
import {mensalidadeService} from '../services/mensalidade';
import {treinoHistoricoService} from '../services/treinoHistorico';

export default function HomeScreen({navigation}: any) {
  const {user, aluno} = useAuth();
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [proximaMensalidade, setProximaMensalidade] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalDisponiveis: 0,
    totalCompletos: 0,
    sequenciaAtual: 0,
    tempoTotal: 0,
  });

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [treinosData, mensalidadeData] = await Promise.all([
        treinoService.getTreinos().catch(() => []),
        mensalidadeService.getProximaMensalidade().catch(() => null),
      ]);
      setTreinos(treinosData);
      setProximaMensalidade(mensalidadeData);
      
      // Calcular estatísticas
      const totalDisponiveis = treinosData.length;
      
      // Contar quantas DIVISÕES foram completadas hoje (não treinos completos)
      const historico = await treinoHistoricoService.getHistorico();
      const hoje = treinoHistoricoService.getDataAtual();
      const divisoesHoje = historico.filter(exec => {
        const dataExec = treinoHistoricoService.getDataFromISO(exec.dataHora);
        return dataExec === hoje && exec.concluido;
      });
      const totalCompletos = divisoesHoje.length;
      
      // Calcular sequência (dias consecutivos treinando)
      const sequenciaAtual = await treinoHistoricoService.getSequenciaConsecutiva();
      
      // Calcular tempo total de treinos (em minutos)
      const tempoTotal = await treinoHistoricoService.getTempoTotalTreinos();
      
      setStats({
        totalDisponiveis,
        totalCompletos,
        sequenciaAtual,
        tempoTotal,
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  const primeiroNome = aluno?.nome?.split(' ')[0] || user?.name?.split(' ')[0] || 'Aluno';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {primeiroNome} 👋</Text>
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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#13ec5b" />
        }>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#13ec5b" />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : (
          <>
            {/* Stats Card */}
            <View style={styles.statsCard}>
              <Text style={styles.statsTitle}>Resumo do Dia</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <MaterialIcons name="fitness-center" size={24} color="#13ec5b" />
                  <Text style={styles.statValue}>{stats.totalDisponiveis}</Text>
                  <Text style={styles.statLabel}>Treinos{"\n"}Disponíveis</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialIcons name="check-circle" size={24} color="#13ec5b" />
                  <Text style={styles.statValue}>{stats.totalCompletos}</Text>
                  <Text style={styles.statLabel}>Completos{"\n"}Hoje</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialIcons name="local-fire-department" size={24} color="#ff6b35" />
                  <Text style={styles.statValue}>{stats.sequenciaAtual}</Text>
                  <Text style={styles.statLabel}>Dias{"\n"}Seguidos</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialIcons name="schedule" size={24} color="#4a90e2" />
                  <Text style={styles.statValue}>{Math.floor(stats.tempoTotal / 60)}h</Text>
                  <Text style={styles.statLabel}>Tempo{"\n"}Total</Text>
                </View>
              </View>
            </View>

            {/* Treino do Dia */}
            {treinos.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>Seu Treino</Text>
                <TouchableOpacity 
                  style={styles.activeWorkoutCard}
                  onPress={() => navigation.navigate('WorkoutActive', {treinoId: treinos[0].id})}>
                  <LinearGradient
                    colors={['#13ec5b', '#0eb545']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={styles.activeWorkoutGradient}>
                    <View style={styles.activeWorkoutHeader}>
                      <MaterialIcons name="fitness-center" size={20} color="rgba(16,34,22,0.8)" />
                      <Text style={styles.activeWorkoutLabel}>TREINO DISPONÍVEL</Text>
                    </View>
                    <Text style={styles.activeWorkoutTitle}>{treinos[0].nome}</Text>
                    {treinos[0].descricao && (
                      <Text style={styles.activeWorkoutDescription} numberOfLines={2}>
                        {treinos[0].descricao}
                      </Text>
                    )}
                    <View style={styles.activeWorkoutInfo}>
                      {treinos[0].dia_semana && (
                        <View style={styles.activeWorkoutInfoItem}>
                          <MaterialIcons name="event" size={18} color="rgba(16,34,22,0.8)" />
                          <Text style={styles.activeWorkoutInfoText}>{treinos[0].dia_semana.nome}</Text>
                        </View>
                      )}
                      {treinos[0].exercicios && (
                        <View style={styles.activeWorkoutInfoItem}>
                          <MaterialIcons name="fitness-center" size={18} color="rgba(16,34,22,0.8)" />
                          <Text style={styles.activeWorkoutInfoText}>{treinos[0].exercicios.length} exercícios</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.startButton}>
                      <Text style={styles.startButtonText}>Iniciar Treino</Text>
                      <MaterialIcons name="arrow-forward" size={20} color="#102216" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.emptyWorkoutCard}>
                <MaterialIcons name="fitness-center" size={48} color="#666" />
                <Text style={styles.emptyWorkoutTitle}>Nenhum treino disponível</Text>
                <Text style={styles.emptyWorkoutText}>
                  Aguarde seu personal trainer criar um treino para você
                </Text>
              </View>
            )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => treinos.length > 0 && navigation.navigate('WorkoutActive', {treinoId: treinos[0].id})}>
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

          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Workouts')}>
            <View style={[styles.actionIcon, {backgroundColor: 'rgba(175,82,222,0.1)'}]}>
              <MaterialIcons name="fitness-center" size={28} color="#AF52DE" />
            </View>
            <Text style={styles.actionLabel}>Ver Treinos</Text>
          </TouchableOpacity>
        </View>

        {/* Mensalidade */}
        {proximaMensalidade && (
          <>
            <Text style={styles.sectionTitle}>Próxima Mensalidade</Text>
            <View style={styles.mensalidadeCard}>
              <View style={styles.mensalidadeIcon}>
                <MaterialIcons name="payment" size={32} color="#ff9500" />
              </View>
              <View style={styles.mensalidadeInfo}>
                <Text style={styles.mensalidadeValor}>
                  R$ {proximaMensalidade.valor?.toFixed(2)}
                </Text>
                <Text style={styles.mensalidadeVencimento}>
                  Vencimento: {new Date(proximaMensalidade.data_vencimento).toLocaleDateString('pt-BR')}
                </Text>
              </View>
              <TouchableOpacity style={styles.mensalidadeButton} onPress={() => navigation.navigate('Plan')}>
                <Text style={styles.mensalidadeButtonText}>Ver Detalhes</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#102216',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#92c9a4',
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
  statsCard: {
    backgroundColor: '#1a1f1e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2a2f2e',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
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
    marginBottom: 8,
  },
  activeWorkoutDescription: {
    fontSize: 14,
    color: 'rgba(16,34,22,0.7)',
    marginBottom: 16,
    lineHeight: 20,
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
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(16,34,22,0.15)',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  startButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#102216',
  },
  emptyWorkoutCard: {
    backgroundColor: '#1a3322',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 12,
  },
  emptyWorkoutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  emptyWorkoutText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
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
  mensalidadeCard: {
    backgroundColor: '#1a3322',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  mensalidadeIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,149,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mensalidadeInfo: {
    flex: 1,
    gap: 4,
  },
  mensalidadeValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  mensalidadeVencimento: {
    fontSize: 13,
    color: '#666',
  },
  mensalidadeButton: {
    backgroundColor: 'rgba(255,149,0,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  mensalidadeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ff9500',
  },
});
