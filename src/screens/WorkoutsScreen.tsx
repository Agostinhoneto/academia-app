import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialIcons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {treinoService, Treino} from '../services/treino';
import {treinoHistoricoService} from '../services/treinoHistorico';

export default function WorkoutsScreen({navigation}: any) {
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [stats, setStats] = useState({
    totalDisponiveis: 0,
    totalCompletos: 0,
    sequenciaAtual: 0,
    tempoTotal: 0,
  });

  useEffect(() => {
    loadTreinos();
  }, []);

  async function loadTreinos() {
    try {
      setLoading(true);
      const data = await treinoService.getTreinos();
      
      // Enriquecer treinos com informações de status
      const treinosComStatus = await Promise.all(
        data.map(async (treino) => {
          const feitoHoje = await treinoHistoricoService.foiFeitoHoje(treino.id);
          const ultimaExec = await treinoHistoricoService.getUltimaExecucao(treino.id);
          
          return {
            ...treino,
            feitoHoje,
            ehTreinoDoDia: false, // Será definido depois
            ultimaExecucao: ultimaExec?.dataHora,
          };
        })
      );
      
      // Determinar qual é o treino do dia considerando os já feitos
      const treinoDoDiaId = await treinoHistoricoService.getProximoTreinoDisponivel(treinosComStatus);
      
      // Atualizar flag ehTreinoDoDia
      const treinosFinais = treinosComStatus.map(treino => ({
        ...treino,
        ehTreinoDoDia: treino.id === treinoDoDiaId && !treino.feitoHoje,
      }));
      
      setTreinos(treinosFinais);
      
      // Calcular estatísticas
      const totalDisponiveis = treinosFinais.length;
      const totalCompletos = treinosFinais.filter(t => t.feitoHoje).length;
      
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
      
      // Verificar se todos foram feitos hoje
      const todosFeitosHoje = treinosFinais.every(t => t.feitoHoje);
      if (todosFeitosHoje && treinosFinais.length > 0) {
        console.log('🎉 Todos os treinos foram completados hoje!');
      }
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadTreinos();
    setRefreshing(false);
  }

  async function handleIniciarTreino(treino: Treino) {
    // Verificar se já foi feito hoje
    if (treino.feitoHoje) {
      Alert.alert(
        'Treino já realizado',
        'Você já completou este treino hoje. Tente novamente amanhã!',
        [{text: 'OK'}]
      );
      return;
    }

    // Avisar se não é o treino do dia
    if (!treino.ehTreinoDoDia) {
      const mensagem = treino.dia_semana?.nome 
        ? `Este treino está programado para ${treino.dia_semana.nome}. Deseja fazer mesmo assim?`
        : 'Este não é o treino sugerido para hoje. Deseja continuar mesmo assim?';
        
      Alert.alert(
        'Atenção',
        mensagem,
        [
          {text: 'Cancelar', style: 'cancel'},
          {
            text: 'Continuar',
            onPress: () => navigation.navigate('WorkoutActive', {treinoId: treino.id})
          }
        ]
      );
      return;
    }

    // Tudo certo, pode iniciar
    navigation.navigate('WorkoutActive', {treinoId: treino.id});
  }

  const categories = ['Todos', ...new Set(treinos.map(t => t.tipo).filter(Boolean))];

  const filteredWorkouts = selectedCategory === 'Todos' 
    ? treinos 
    : treinos.filter(t => t.tipo === selectedCategory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Treinos</Text>
        <TouchableOpacity style={styles.searchButton}>
          <MaterialIcons name="search" size={24} color="#fff" />
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
            <Text style={styles.loadingText}>Carregando treinos...</Text>
          </View>
        ) : treinos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="fitness-center" size={64} color="#666" />
            <Text style={styles.emptyText}>Nenhum treino encontrado</Text>
            <Text style={styles.emptySubtext}>Seu personal trainer ainda não criou treinos para você</Text>
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
            
            {/* Category Filters */}
            {categories.length > 1 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScroll}
                contentContainerStyle={styles.categories}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      selectedCategory === category && styles.categoryChipActive,
                    ]}
                    onPress={() => setSelectedCategory(category)}>
                    <Text
                      style={[
                        styles.categoryChipText,
                        selectedCategory === category && styles.categoryChipTextActive,
                      ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Workouts List */}
            <View style={styles.workoutsList}>
              {filteredWorkouts.map((treino) => {
                const podeIniciar = !treino.feitoHoje;
                
                return (
                  <TouchableOpacity 
                    key={treino.id} 
                    style={[
                      styles.workoutCard,
                      treino.ehTreinoDoDia && styles.workoutCardDestaque,
                      treino.feitoHoje && styles.workoutCardCompleto,
                    ]}
                    onPress={() => handleIniciarTreino(treino)}
                    activeOpacity={0.7}
                    disabled={treino.feitoHoje}>
                    
                    {/* Badge de destaque para treino do dia */}
                    {treino.ehTreinoDoDia && !treino.feitoHoje && (
                      <View style={styles.badgeDestaque}>
                        <MaterialIcons name="star" size={12} color="#fff" />
                        <Text style={styles.badgeDestaqueText}>TREINO DE HOJE</Text>
                      </View>
                    )}
                    
                    {/* Badge de completo */}
                    {treino.feitoHoje && (
                      <View style={styles.badgeCompleto}>
                        <MaterialIcons name="check-circle" size={16} color="#13ec5b" />
                        <Text style={styles.badgeCompletoText}>CONCLUÍDO HOJE</Text>
                      </View>
                    )}
                    
                    <View style={styles.workoutCardContent}>
                      <View style={[
                        styles.workoutIcon, 
                        {backgroundColor: treino.feitoHoje ? 'rgba(102,102,102,0.1)' : 'rgba(19,236,91,0.1)'}
                      ]}>
                        <MaterialIcons 
                          name={treino.feitoHoje ? "check-circle" : "fitness-center"} 
                          size={28} 
                          color={treino.feitoHoje ? "#666" : "#13ec5b"} 
                        />
                      </View>
                      
                      <View style={styles.workoutInfo}>
                        <Text style={[
                          styles.workoutName,
                          treino.feitoHoje && styles.workoutNameCompleto
                        ]}>
                          {treino.nome}
                        </Text>
                        {treino.descricao && (
                          <Text style={styles.workoutDescription} numberOfLines={2}>
                            {treino.descricao}
                          </Text>
                        )}
                        <View style={styles.workoutMeta}>
                        {treino.dia_semana && (
                          <View style={styles.metaItem}>
                            <MaterialIcons name="event" size={16} color="#666" />
                            <Text style={styles.metaText}>{treino.dia_semana.nome}</Text>
                          </View>
                        )}
                        {treino.grupo_muscular && (
                          <>
                            {treino.dia_semana && <View style={styles.metaDivider} />}
                            <View style={styles.metaItem}>
                              <MaterialIcons name="fitness-center" size={16} color="#666" />
                              <Text style={styles.metaText}>{treino.grupo_muscular.nome}</Text>
                            </View>
                          </>
                        )}
                        {treino.exercicios && treino.exercicios.length > 0 && (
                          <>
                            <View style={styles.metaDivider} />
                            <View style={styles.metaItem}>
                              <Text style={styles.metaText}>{treino.exercicios.length} exercícios</Text>
                            </View>
                          </>
                        )}
                      </View>
                      <View style={styles.badges}>
                        {treino.tipo && (
                          <View style={[styles.badge, {backgroundColor: 'rgba(19,236,91,0.1)'}]}>
                            <Text style={[styles.badgeText, {color: '#13ec5b'}]}>{treino.tipo}</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <MaterialIcons 
                      name={treino.feitoHoje ? "lock" : "chevron-right"} 
                      size={24} 
                      color={treino.feitoHoje ? "#666" : "#13ec5b"} 
                    />
                  </View>
                </TouchableOpacity>
              );
              })}
            </View>
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  scrollCDescription: {
    fontSize: 13,
    color: '#92c9a4',
    lineHeight: 18,
  },
  workoutontent: {
    paddingBottom: 100,
  },
  statsCard: {
    backgroundColor: '#1a1f1e',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
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
  categoriesScroll: {
    marginVertical: 16,
  },
  categories: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryChipActive: {
    backgroundColor: '#13ec5b',
    borderColor: '#13ec5b',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92c9a4',
  },
  categoryChipTextActive: {
    color: '#102216',
  },
  workoutsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  workoutCard: {
    backgroundColor: '#1a3322',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    position: 'relative',
  },
  workoutCardDestaque: {
    borderWidth: 2,
    borderColor: '#13ec5b',
    shadowColor: '#13ec5b',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  workoutCardCompleto: {
    opacity: 0.6,
    backgroundColor: 'rgba(26,51,34,0.5)',
  },
  badgeDestaque: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#13ec5b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  badgeDestaqueText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#102216',
    letterSpacing: 0.5,
  },
  badgeCompleto: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(19,236,91,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#13ec5b',
    zIndex: 10,
  },
  badgeCompletoText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#13ec5b',
    letterSpacing: 0.5,
  },
  workoutCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  workoutIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutInfo: {
    flex: 1,
    gap: 8,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  workoutNameCompleto: {
    color: '#666',
    textDecorationLine: 'line-through',
  },
  workoutDescription: {
    fontSize: 13,
    color: '#92c9a4',
    lineHeight: 18,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
  },
  metaDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#666',
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  createWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(19,236,91,0.1)',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(19,236,91,0.3)',
  },
  createWorkoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#13ec5b',
  },
});
