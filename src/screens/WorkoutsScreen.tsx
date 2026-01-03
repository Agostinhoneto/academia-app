import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialIcons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {treinoService, Treino} from '../services/treino';

export default function WorkoutsScreen({navigation}: any) {
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    loadTreinos();
  }, []);

  async function loadTreinos() {
    try {
      setLoading(true);
      const data = await treinoService.getTreinos();
      setTreinos(data);
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
              {filteredWorkouts.map((treino) => (
                <TouchableOpacity 
                  key={treino.id} 
                  style={styles.workoutCard}
                  onPress={() => navigation.navigate('WorkoutActive', {treinoId: treino.id})}
                  activeOpacity={0.7}>
                  <View style={styles.workoutCardContent}>
                    <View style={[styles.workoutIcon, {backgroundColor: 'rgba(19,236,91,0.1)'}]}>
                      <MaterialIcons name="fitness-center" size={28} color="#13ec5b" />
                    </View>
                    
                    <View style={styles.workoutInfo}>
                      <Text style={styles.workoutName}>{treino.nome}</Text>
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

                    <MaterialIcons name="chevron-right" size={24} color="#666" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  scrollCDescription: {
    fontSize: 13,
    color: '#92c9a4',
    lineHeight: 18,
  },
  workoutontent: {
    paddingBottom: 100,
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
