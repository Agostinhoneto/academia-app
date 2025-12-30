import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const WORKOUTS = [
  {
    id: '1',
    name: 'Treino de Peito',
    duration: 45,
    exercises: 8,
    category: 'Força',
  },
  {
    id: '2',
    name: 'Treino de Costas',
    duration: 50,
    exercises: 9,
    category: 'Força',
  },
  {
    id: '3',
    name: 'Cardio HIIT',
    duration: 30,
    exercises: 6,
    category: 'Cardio',
  },
  {
    id: '4',
    name: 'Treino de Pernas',
    duration: 60,
    exercises: 10,
    category: 'Força',
  },
];

export default function WorkoutsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Meus Treinos</Text>
        
        {WORKOUTS.map((workout) => (
          <TouchableOpacity key={workout.id} style={styles.workoutCard}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{workout.category}</Text>
            </View>
            <Text style={styles.workoutName}>{workout.name}</Text>
            <View style={styles.workoutInfo}>
              <Text style={styles.infoText}>{workout.duration} min</Text>
              <Text style={styles.infoDivider}>•</Text>
              <Text style={styles.infoText}>{workout.exercises} exercícios</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  workoutName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  workoutInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  infoDivider: {
    marginHorizontal: 8,
    color: '#666',
  },
});
