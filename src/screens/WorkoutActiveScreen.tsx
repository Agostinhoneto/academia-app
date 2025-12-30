import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialIcons} from '@expo/vector-icons';

interface Set {
  number: number;
  weight: number;
  reps: number;
  completed: boolean;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restTime: number;
  image: string;
  sets_data: Set[];
  lastRecord?: string;
  isActive?: boolean;
}

export default function WorkoutActiveScreen({navigation}: any) {
  const [timer, setTimer] = useState(765); // 12:45 em segundos
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: '1',
      name: 'Supino Reto com Barra',
      sets: 4,
      reps: '10-12',
      restTime: 90,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200',
      lastRecord: '58kg x 10',
      isActive: true,
      sets_data: [
        {number: 1, weight: 60, reps: 12, completed: true},
        {number: 2, weight: 60, reps: 10, completed: false},
        {number: 3, weight: 60, reps: 10, completed: false},
        {number: 4, weight: 60, reps: 8, completed: false},
      ],
    },
    {
      id: '2',
      name: 'Crucifixo Inclinado',
      sets: 3,
      reps: '12-15',
      restTime: 60,
      image: 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=200',
      sets_data: [],
    },
    {
      id: '3',
      name: 'Tríceps Corda',
      sets: 4,
      reps: '15',
      restTime: 60,
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200',
      sets_data: [],
    },
  ]);

  const handleCompleteSet = (exerciseId: string, setNumber: number) => {
    setExercises(prev =>
      prev.map(ex => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets_data: ex.sets_data.map(set =>
              set.number === setNumber ? {...set, completed: true} : set
            ),
          };
        }
        return ex;
      })
    );
  };

  const completedCount = 3;
  const totalExercises = 8;
  const progress = (completedCount / totalExercises) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerSubtitle}>DIA 24</Text>
            <Text style={styles.headerTitle}>Treino Atual</Text>
          </View>
          
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="more-vert" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Timer Bar */}
        <View style={styles.timerBar}>
          <View style={styles.timerLeft}>
            <MaterialIcons name="timer" size={20} color="#13ec5b" />
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
          </View>
          
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>EM ANDAMENTO</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Workout Info */}
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutTitle}>Treino A - Peito e Tríceps</Text>
          <Text style={styles.workoutDescription}>
            Foco em hipertrofia e força máxima. Descanse 90s entre as séries.
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progresso</Text>
              <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, {width: `${progress}%`}]} />
            </View>
            <Text style={styles.progressText}>
              {completedCount} de {totalExercises} Exercícios Completos
            </Text>
          </View>
        </View>

        {/* Segmented Control */}
        <View style={styles.segmentedControl}>
          <View style={styles.segmentedWrapper}>
            <TouchableOpacity
              style={[styles.segment, activeTab === 'pending' && styles.segmentActive]}
              onPress={() => setActiveTab('pending')}
            >
              <Text style={[styles.segmentText, activeTab === 'pending' && styles.segmentTextActive]}>
                A Fazer (5)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segment, activeTab === 'completed' && styles.segmentActive]}
              onPress={() => setActiveTab('completed')}
            >
              <Text style={[styles.segmentText, activeTab === 'completed' && styles.segmentTextActive]}>
                Concluídos (3)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Exercise List */}
        <View style={styles.exerciseList}>
          {exercises.map(exercise => (
            <View key={exercise.id}>
              {exercise.isActive ? (
                // Active Exercise Card
                <View style={styles.activeExerciseCard}>
                  <View style={styles.activeIndicator} />
                  
                  <View style={styles.exerciseHeader}>
                    <View style={styles.exerciseImageContainer}>
                      <Image source={{uri: exercise.image}} style={styles.exerciseImage} />
                      <View style={styles.exerciseImageOverlay} />
                      <MaterialIcons name="fitness-center" size={18} color="#fff" style={styles.exerciseImageIcon} />
                    </View>
                    
                    <View style={styles.exerciseHeaderInfo}>
                      <View style={styles.exerciseHeaderTop}>
                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                        <TouchableOpacity>
                          <MaterialIcons name="info-outline" size={20} color="#92c9a4" />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.exerciseMeta}>
                        <View style={styles.metaItem}>
                          <MaterialIcons name="repeat" size={16} color="#92c9a4" />
                          <Text style={styles.metaText}>{exercise.sets} Séries</Text>
                        </View>
                        <View style={styles.metaDot} />
                        <View style={styles.metaItem}>
                          <MaterialIcons name="timer" size={16} color="#92c9a4" />
                          <Text style={styles.metaText}>{exercise.restTime}s</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Sets Table */}
                  <View style={styles.setsContainer}>
                    <View style={styles.setsHeader}>
                      <Text style={[styles.setsHeaderText, {flex: 1}]}>SET</Text>
                      <Text style={[styles.setsHeaderText, {flex: 1.5}]}>KG</Text>
                      <Text style={[styles.setsHeaderText, {flex: 1.5}]}>REPS</Text>
                      <Text style={[styles.setsHeaderText, {flex: 2}]}>STATUS</Text>
                    </View>

                    {exercise.sets_data.map(set => (
                      <View
                        key={set.number}
                        style={[
                          styles.setRow,
                          set.completed && styles.setRowCompleted,
                          !set.completed && set.number === 2 && styles.setRowCurrent,
                        ]}
                      >
                        <View style={styles.setNumberContainer}>
                          <View style={[
                            styles.setNumber,
                            set.completed && styles.setNumberDone,
                            !set.completed && set.number === 2 && styles.setNumberActive,
                          ]}>
                            <Text style={[
                              styles.setNumberText,
                              (set.completed || set.number === 2) && styles.setNumberTextActive,
                            ]}>
                              {set.number}
                            </Text>
                          </View>
                        </View>

                        {set.number === 2 && !set.completed ? (
                          <>
                            <View style={styles.inputContainer}>
                              <TextInput
                                style={styles.setInput}
                                value={set.weight.toString()}
                                keyboardType="number-pad"
                              />
                            </View>
                            <View style={styles.inputContainer}>
                              <TextInput
                                style={styles.setInput}
                                value={set.reps.toString()}
                                keyboardType="number-pad"
                              />
                            </View>
                            <View style={styles.setActionContainer}>
                              <TouchableOpacity
                                style={styles.doneButton}
                                onPress={() => handleCompleteSet(exercise.id, set.number)}
                              >
                                <Text style={styles.doneButtonText}>FEITO</Text>
                              </TouchableOpacity>
                            </View>
                          </>
                        ) : (
                          <>
                            <Text style={[styles.setValue, set.completed && styles.setValueDone]}>
                              {set.weight}
                            </Text>
                            <Text style={[styles.setValue, set.completed && styles.setValueDone]}>
                              {set.reps}
                            </Text>
                            <View style={styles.setActionContainer}>
                              <TouchableOpacity
                                style={[
                                  styles.checkButton,
                                  set.completed && styles.checkButtonDone,
                                ]}
                                disabled={set.completed}
                              >
                                <MaterialIcons
                                  name={set.completed ? 'check' : 'check-box-outline-blank'}
                                  size={20}
                                  color={set.completed ? '#13ec5b' : '#666'}
                                />
                              </TouchableOpacity>
                            </View>
                          </>
                        )}
                      </View>
                    ))}
                  </View>

                  {/* Last Record */}
                  {exercise.lastRecord && (
                    <View style={styles.lastRecord}>
                      <View style={styles.lastRecordLeft}>
                        <MaterialIcons name="history" size={14} color="#92c9a4" />
                        <Text style={styles.lastRecordText}>Último: {exercise.lastRecord}</Text>
                      </View>
                      <TouchableOpacity>
                        <Text style={styles.historyLink}>Ver Histórico</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ) : (
                // Pending Exercise Card
                <TouchableOpacity style={styles.pendingExerciseCard}>
                  <View style={styles.pendingImageContainer}>
                    <Image source={{uri: exercise.image}} style={styles.pendingImage} />
                  </View>
                  
                  <View style={styles.pendingInfo}>
                    <Text style={styles.pendingName}>{exercise.name}</Text>
                    <View style={styles.pendingMeta}>
                      <View style={styles.pendingBadge}>
                        <Text style={styles.pendingBadgeText}>{exercise.sets} Séries</Text>
                      </View>
                      <View style={styles.pendingBadge}>
                        <Text style={styles.pendingBadgeText}>{exercise.reps} Reps</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.playButton}>
                    <MaterialIcons name="play-arrow" size={24} color="#666" />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <View style={{height: 120}} />
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cancelButton}>
          <MaterialIcons name="cancel" size={24} color="#ef4444" />
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.finishButton}>
          <MaterialIcons name="flag" size={24} color="#102216" />
          <Text style={styles.finishButtonText}>Finalizar Treino</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#102216',
  },
  header: {
    backgroundColor: 'rgba(16,34,22,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#23482f',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#92c9a4',
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  timerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  timerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontVariant: ['tabular-nums'],
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(19,236,91,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(19,236,91,0.2)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#13ec5b',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#13ec5b',
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  workoutInfo: {
    padding: 20,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  workoutDescription: {
    fontSize: 14,
    color: '#92c9a4',
    marginBottom: 24,
  },
  progressContainer: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#13ec5b',
  },
  progressBarBg: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#23482f',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#13ec5b',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#92c9a4',
    textAlign: 'right',
  },
  segmentedControl: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  segmentedWrapper: {
    flexDirection: 'row',
    backgroundColor: '#23482f',
    borderRadius: 12,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: '#102216',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#92c9a4',
  },
  segmentTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  exerciseList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  activeExerciseCard: {
    borderRadius: 16,
    backgroundColor: '#1a3322',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'rgba(19,236,91,0.5)',
    overflow: 'hidden',
    marginBottom: 16,
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: '#13ec5b',
  },
  exerciseHeader: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  exerciseImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(16,34,22,0.5)',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  exerciseImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  exerciseImageIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  exerciseHeaderInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  exerciseHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#92c9a4',
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666',
  },
  setsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  setsHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  setsHeaderText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#92c9a4',
    letterSpacing: 1,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  setRowCompleted: {
    opacity: 0.5,
  },
  setRowCurrent: {
    backgroundColor: 'rgba(19,236,91,0.05)',
    borderLeftWidth: 2,
    borderLeftColor: '#13ec5b',
  },
  setNumberContainer: {
    flex: 1,
    alignItems: 'center',
  },
  setNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setNumberActive: {
    backgroundColor: '#13ec5b',
  },
  setNumberDone: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  setNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  setNumberTextActive: {
    color: '#102216',
  },
  inputContainer: {
    flex: 1.5,
    paddingHorizontal: 4,
  },
  setInput: {
    backgroundColor: '#1a3322',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  setValue: {
    flex: 1.5,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  setValueDone: {
    color: '#666',
  },
  setActionContainer: {
    flex: 2,
    paddingLeft: 8,
  },
  doneButton: {
    backgroundColor: '#13ec5b',
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#13ec5b',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#102216',
  },
  checkButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButtonDone: {
    backgroundColor: 'rgba(19,236,91,0.2)',
  },
  lastRecord: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  lastRecordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastRecordText: {
    fontSize: 12,
    color: '#92c9a4',
  },
  historyLink: {
    fontSize: 12,
    fontWeight: '500',
    color: '#13ec5b',
  },
  pendingExerciseCard: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
    borderRadius: 16,
    backgroundColor: '#1a3322',
    alignItems: 'center',
    marginBottom: 16,
  },
  pendingImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(16,34,22,0.5)',
  },
  pendingImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  pendingInfo: {
    flex: 1,
    gap: 8,
  },
  pendingName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  pendingMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  pendingBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pendingBadgeText: {
    fontSize: 12,
    color: '#92c9a4',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    paddingTop: 48,
    background: 'linear-gradient(to top, #102216, rgba(16,34,22,0.9), transparent)',
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    height: 56,
    backgroundColor: '#1a3322',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  finishButton: {
    flex: 2,
    flexDirection: 'row',
    height: 56,
    backgroundColor: '#13ec5b',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#13ec5b',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#102216',
  },
});
