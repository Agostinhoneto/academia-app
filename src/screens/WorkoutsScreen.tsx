import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialIcons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';

const WORKOUTS = [
  {
    id: '1',
    name: 'Treino A - Peito e Tríceps',
    duration: 45,
    exercises: 8,
    category: 'Força',
    difficulty: 'Intermediário',
    icon: 'fitness-center',
    color: '#13ec5b',
  },
  {
    id: '2',
    name: 'Treino B - Costas e Bíceps',
    duration: 50,
    exercises: 9,
    category: 'Força',
    difficulty: 'Intermediário',
    icon: 'fitness-center',
    color: '#007AFF',
  },
  {
    id: '3',
    name: 'Treino C - Pernas',
    duration: 60,
    exercises: 10,
    category: 'Força',
    difficulty: 'Avançado',
    icon: 'fitness-center',
    color: '#ff9500',
  },
  {
    id: '4',
    name: 'Cardio HIIT',
    duration: 30,
    exercises: 6,
    category: 'Cardio',
    difficulty: 'Iniciante',
    icon: 'directions-run',
    color: '#FF3B30',
  },
  {
    id: '5',
    name: 'Treino D - Ombros',
    duration: 40,
    exercises: 7,
    category: 'Força',
    difficulty: 'Intermediário',
    icon: 'fitness-center',
    color: '#AF52DE',
  },
];

export default function WorkoutsScreen({navigation}: any) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', 'Força', 'Cardio'];

  const filteredWorkouts = selectedCategory === 'Todos' 
    ? WORKOUTS 
    : WORKOUTS.filter(w => w.category === selectedCategory);

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
        showsVerticalScrollIndicator={false}>
        
        {/* Category Filters */}
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

        {/* Workouts List */}
        <View style={styles.workoutsList}>
          {filteredWorkouts.map((workout) => (
            <TouchableOpacity 
              key={workout.id} 
              style={styles.workoutCard}
              onPress={() => navigation.navigate('WorkoutActive')}
              activeOpacity={0.7}>
              <View style={styles.workoutCardContent}>
                <View style={[styles.workoutIcon, {backgroundColor: `${workout.color}15`}]}>
                  <MaterialIcons name={workout.icon as any} size={28} color={workout.color} />
                </View>
                
                <View style={styles.workoutInfo}>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <View style={styles.workoutMeta}>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="timer" size={16} color="#666" />
                      <Text style={styles.metaText}>{workout.duration} min</Text>
                    </View>
                    <View style={styles.metaDivider} />
                    <View style={styles.metaItem}>
                      <MaterialIcons name="fitness-center" size={16} color="#666" />
                      <Text style={styles.metaText}>{workout.exercises} exercícios</Text>
                    </View>
                  </View>
                  <View style={styles.badges}>
                    <View style={[styles.badge, {backgroundColor: 'rgba(19,236,91,0.1)'}]}>
                      <Text style={[styles.badgeText, {color: '#13ec5b'}]}>{workout.category}</Text>
                    </View>
                    <View style={[styles.badge, {backgroundColor: 'rgba(146,201,164,0.1)'}]}>
                      <Text style={[styles.badgeText, {color: '#92c9a4'}]}>{workout.difficulty}</Text>
                    </View>
                  </View>
                </View>

                <MaterialIcons name="chevron-right" size={24} color="#666" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Criar Novo Treino */}
        <TouchableOpacity style={styles.createWorkoutButton}>
          <MaterialIcons name="add-circle" size={24} color="#13ec5b" />
          <Text style={styles.createWorkoutText}>Criar Novo Treino</Text>
        </TouchableOpacity>
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
