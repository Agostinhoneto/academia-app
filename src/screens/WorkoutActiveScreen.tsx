import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialIcons} from '@expo/vector-icons';
import {treinoService, Treino, ExercicioTreino} from '../services/treino';
import {treinoHistoricoService} from '../services/treinoHistorico';
import {getExerciseImage} from '../utils/exerciseImages';

interface Set {
  number: number;
  weight: string;
  reps: number;
  completed: boolean;
}

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: string;
  carga?: string;
  image?: string;
  observacoes?: string;
  sets_data: Set[];
  isActive?: boolean;
  divisao?: string; // A, B, C, etc
}

export default function WorkoutActiveScreen({navigation, route}: any) {
  const {treinoId} = route.params || {};
  const [treino, setTreino] = useState<Treino | null>(null);
  const [loading, setLoading] = useState(true);
  const [finalizando, setFinalizando] = useState(false);
  const [timer, setTimer] = useState(0);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [divisaoAtual, setDivisaoAtual] = useState<string>('A'); // Começa pela divisão A

  useEffect(() => {
    console.log('🔵 WorkoutActiveScreen montado. treinoId:', treinoId);
    if (treinoId) {
      loadTreino();
    } else {
      console.log('❌ Nenhum treinoId fornecido');
      Alert.alert('Erro', 'ID do treino não fornecido');
      navigation.goBack();
    }
  }, [treinoId]);

  async function loadTreino() {
    try {
      console.log('🔄 Iniciando carregamento do treino ID:', treinoId);
      setLoading(true);
      const data = await treinoService.getTreinoById(treinoId);
      console.log('📦 Dados do treino recebidos:', data);
      setTreino(data);
      
      // Converter exercícios do treino para o formato do componente
      if (data.exercicios && data.exercicios.length > 0) {
        console.log(`✅ ${data.exercicios.length} exercícios encontrados`);
        const mappedExercises: Exercise[] = data.exercicios.map((ex: any, index) => {
          // Usar imagem_url ou imagem_complete da API (já vem com URL completa)
          let imageUrl = ex.imagem_url || ex.imagem_complete;
          
          // Substituir localhost pelo IP/URL correto em todas as plataformas
          if (imageUrl && imageUrl.includes('localhost')) {
            if (Platform.OS === 'web') {
              // No Web, pode usar localhost ou trocar pelo IP se preferir
              imageUrl = imageUrl.replace('localhost', 'localhost');
            } else {
              // iOS/Android precisa do IP da máquina
              imageUrl = imageUrl.replace('localhost', '192.168.1.222');
            }
          }
          
          // Se não vier imagem da API, tenta pegar do mapeamento local
          if (!imageUrl) {
            imageUrl = getExerciseImage(ex.nome);
          }
          
          console.log(`🖼️ Exercício ${ex.nome}: URL da imagem =`, imageUrl);
          
          // Os dados de séries/reps/carga estão diretos (não mais no pivot)
          const series = ex.series || ex.pivot?.series || 3;
          const repeticoes = ex.repeticoes?.toString() || ex.pivot?.repeticoes?.toString() || '10';
          const carga = ex.carga?.toString() || ex.pivot?.carga?.toString() || '0';
          const divisao = ex.divisao || 'A'; // Default para A se não tiver
          
          return {
            id: ex.id,
            name: ex.nome || `Exercício ${index + 1}`,
            sets: series,
            reps: repeticoes,
            carga: carga + 'kg',
            image: imageUrl,
            observacoes: ex.descricao,
            divisao: divisao,
            sets_data: Array.from({length: series}, (_, i) => ({
              number: i + 1,
              weight: carga,
              reps: parseInt(repeticoes) || 0,
              completed: false,
            })),
            isActive: index === 0,
          };
        });
        
        // Ordenar exercícios por divisão (A, B, C...)
        mappedExercises.sort((a, b) => {
          const divisaoA = a.divisao || 'A';
          const divisaoB = b.divisao || 'A';
          return divisaoA.localeCompare(divisaoB);
        });
        
        setExercises(mappedExercises);
        console.log('✅ Exercícios mapeados e ordenados por divisão:', mappedExercises.length);
        
        // Log das divisões encontradas
        const divisoes = [...new Set(mappedExercises.map(e => e.divisao))];
        console.log('📊 Divisões encontradas:', divisoes.join(', '));
        
        // 🎯 DETECTAR QUAL DIVISÃO CARREGAR
        const divisoesDisponiveis = divisoes.filter(Boolean).sort() as string[];
        
        if (divisoesDisponiveis.length > 0) {
          const proximaDivisao = await treinoHistoricoService.getProximaDivisao(
            treinoId,
            divisoesDisponiveis
          );
          
          if (proximaDivisao) {
            console.log(`🎯 Carregando divisão: ${proximaDivisao}`);
            setDivisaoAtual(proximaDivisao);
            
            // Ativar primeiro exercício da divisão carregada
            const exerciciosDaDivisao = mappedExercises.filter(e => e.divisao === proximaDivisao);
            if (exerciciosDaDivisao.length > 0) {
              setExercises(prev => prev.map(ex => ({
                ...ex,
                isActive: ex.id === exerciciosDaDivisao[0].id
              })));
            }
          } else {
            // Todas divisões foram feitas hoje
            console.log('✅ Todas as divisões foram completadas hoje!');
            Alert.alert(
              'Treino Completo! 🎉',
              'Você já completou todas as divisões deste treino hoje. Volte amanhã para fazer novamente!',
              [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack()
                }
              ]
            );
          }
        }
      } else {
        console.log('⚠️ Nenhum exercício encontrado no treino');
      }
    } catch (error: any) {
      console.error('❌ Erro ao carregar treino:', error);
      console.error('❌ Detalhes do erro:', error.response?.data || error.message);
      Alert.alert('Erro', `Não foi possível carregar o treino: ${error.message}`);
      navigation.goBack();
    } finally {
      console.log('✅ Carregamento finalizado');
      setLoading(false);
    }
  }

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

  const handleCompleteSet = (exerciseId: number, setNumber: number) => {
    setExercises(prev => {
      const currentIndex = prev.findIndex(e => e.id === exerciseId);
      
      return prev.map((ex, idx) => {
        if (ex.id === exerciseId) {
          // Atualizar o set como completo
          const updatedSets = ex.sets_data.map(set =>
            set.number === setNumber ? {...set, completed: true} : set
          );
          
          // Verificar se todos os sets foram completos APÓS essa atualização
          const allCompleted = updatedSets.every(s => s.completed);
          
          console.log(`✅ Set ${setNumber} do exercício ${ex.name} marcado como completo. Todos completos: ${allCompleted}`);
          
          return {
            ...ex,
            sets_data: updatedSets,
            isActive: !allCompleted, // Desativa se todos completados
          };
        }
        
        // Se este é o próximo exercício após o que foi completado
        if (idx === currentIndex + 1) {
          // Verifica se o exercício atual (anterior) teve todos os sets completos
          const currentEx = prev[currentIndex];
          const currentExSets = currentEx.sets_data.map(set =>
            set.number === setNumber ? {...set, completed: true} : set
          );
          const currentIsComplete = currentExSets.every(s => s.completed);
          
          if (currentIsComplete) {
            console.log(`🎯 Ativando próximo exercício: ${ex.name}`);
            return {...ex, isActive: true};
          }
        }
        
        return ex;
      });
    });
  };

  // Calcular progresso dinamicamente
  const exerciciosDaDivisaoAtual = exercises.filter(ex => ex.divisao === divisaoAtual);
  const completedCount = exerciciosDaDivisaoAtual.filter(ex => 
    ex.sets_data.every(set => set.completed)
  ).length;
  const totalExercises = exerciciosDaDivisaoAtual.length;
  const progress = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0;
  
  // Verificar se todos os exercícios da divisão atual foram completados
  const divisaoCompletada = totalExercises > 0 && completedCount === totalExercises;
  
  // Listar divisões disponíveis
  const divisoesDisponiveis = [...new Set(exercises.map(e => e.divisao).filter(Boolean))].sort();
  const indexDivisaoAtual = divisoesDisponiveis.indexOf(divisaoAtual);
  const proximaDivisao = indexDivisaoAtual < divisoesDisponiveis.length - 1 
    ? divisoesDisponiveis[indexDivisaoAtual + 1] 
    : null;

  async function handleFinalizarTreino() {
    console.log('✅ Confirmado - iniciando finalização da divisão:', divisaoAtual);
    console.log('🔍 TreinoId:', treinoId, 'Tipo:', typeof treinoId);
    
    if (!treinoId) {
      Alert.alert('Erro', 'ID do treino não encontrado');
      return;
    }
    
    setFinalizando(true);
    
    try {
      // Converter para número se necessário
      const id = typeof treinoId === 'string' ? parseInt(treinoId) : treinoId;
      console.log('🔢 ID convertido:', id);
      
      // Salvar execução da divisão atual no histórico local
      await treinoHistoricoService.salvarExecucao(id, divisaoAtual);
      console.log(`✅ Divisão ${divisaoAtual} salva no histórico local`);
      
      // Tentar enviar para API
      try {
        await treinoService.finalizarTreino(id);
        console.log('✅ Treino finalizado na API');
      } catch (apiError) {
        console.log('⚠️ Erro ao finalizar na API, mas salvo localmente:', apiError);
      }
      
      // Sucesso - resetar estado e voltar
      setFinalizando(false);
      
      if (Platform.OS === 'web') {
        window.alert(`Divisão ${divisaoAtual} Concluída! 🎉\n\nParabéns! Continue assim.`);
        navigation.goBack();
      } else {
        Alert.alert(
          `Divisão ${divisaoAtual} Concluída! 🎉`,
          'Parabéns! Continue assim.',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('🔙 Voltando para tela anterior');
                navigation.goBack();
              }
            }
          ]
        );
      }
    } catch (error: any) {
      console.error('❌ Erro ao finalizar treino:', error);
      console.error('❌ Mensagem:', error.message);
      setFinalizando(false);
      
      if (Platform.OS === 'web') {
        window.alert(`Erro: Não foi possível finalizar o treino: ${error.message}`);
      } else {
        Alert.alert('Erro', `Não foi possível finalizar o treino: ${error.message}`);
      }
    }
  }

  console.log('🎯 WorkoutActiveScreen renderizando - loading:', loading, 'treino:', !!treino);

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
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#13ec5b" />
          <Text style={styles.loadingText}>Carregando treino...</Text>
        </View>
      ) : !treino || exercises.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="fitness-center" size={64} color="#666" />
          <Text style={styles.emptyText}>Nenhum exercício encontrado</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Workout Info */}
          <View style={styles.workoutInfo}>
            <Text style={styles.workoutTitle}>{treino.nome}</Text>
            {treino.descricao && (
              <Text style={styles.workoutDescription}>{treino.descricao}</Text>
            )}
            
            {/* Indicador de Divisão Atual */}
            {divisoesDisponiveis.length > 1 && (
              <View style={styles.divisaoIndicator}>
                <Text style={styles.divisaoLabel}>Divisão Atual:</Text>
                <View style={styles.divisoesContainer}>
                  {divisoesDisponiveis.map((div) => (
                    <View 
                      key={div}
                      style={[
                        styles.divisaoChip,
                        div === divisaoAtual && styles.divisaoChipActive,
                        divisoesDisponiveis.indexOf(div) > indexDivisaoAtual && styles.divisaoChipLocked
                      ]}
                    >
                      <Text style={[
                        styles.divisaoChipText,
                        div === divisaoAtual && styles.divisaoChipTextActive
                      ]}>
                        {div}
                      </Text>
                      {divisoesDisponiveis.indexOf(div) > indexDivisaoAtual && (
                        <MaterialIcons name="lock" size={12} color="#666" />
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}

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
                {completedCount} de {totalExercises} Exercícios Completos (Divisão {divisaoAtual})
              </Text>
            </View>
            
            {/* Botão para próxima divisão */}
            {divisaoCompletada && proximaDivisao && (
              <TouchableOpacity 
                style={styles.proximaDivisaoButton}
                onPress={() => {
                  console.log(`🔄 Avançando para divisão ${proximaDivisao}`);
                  setDivisaoAtual(proximaDivisao);
                  // Ativar o primeiro exercício da próxima divisão
                  const proximosExercicios = exercises.filter(e => e.divisao === proximaDivisao);
                  if (proximosExercicios.length > 0) {
                    setExercises(prev => prev.map(ex => ({
                      ...ex,
                      isActive: ex.id === proximosExercicios[0].id
                    })));
                  }
                }}
              >
                <MaterialIcons name="arrow-forward" size={20} color="#102216" />
                <Text style={styles.proximaDivisaoButtonText}>
                  Avançar para Divisão {proximaDivisao}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Exercise List - Filtrado por divisão */}
          <View style={styles.exerciseList}>
          {exercises
            .filter(exercise => exercise.divisao === divisaoAtual)
            .map((exercise, idx) => {
            const isCompleted = exercise.sets_data.every(s => s.completed);
            console.log(`🏋️ Renderizando exercício ${idx + 1}/${exercises.length}: ${exercise.name} - Ativo: ${exercise.isActive}, Completo: ${isCompleted}`);
            
            return (
              <View 
                key={exercise.id}
                style={[
                  styles.exerciseCard,
                  exercise.isActive && styles.activeExerciseCardBorder,
                  isCompleted && styles.completedExerciseCard,
                ]}
              >
                {exercise.isActive && <View style={styles.activeIndicator} />}
                
                {/* Cabeçalho do Exercício */}
                <TouchableOpacity 
                  style={styles.exerciseCardHeader}
                  onPress={() => {
                    console.log('Exercício clicado:', exercise.name);
                  }}
                >
                  <View style={styles.pendingImageContainer}>
                    {exercise.image ? (
                      <Image 
                        source={{uri: exercise.image}} 
                        style={styles.pendingImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <MaterialIcons 
                        name="fitness-center" 
                        size={32} 
                        color={isCompleted ? "#666" : exercise.isActive ? "#13ec5b" : "#666"} 
                      />
                    )}
                  </View>
                  
                  <View style={styles.pendingInfo}>
                    <Text style={[
                      styles.pendingName,
                      isCompleted && styles.completedText
                    ]}>
                      {exercise.name}
                    </Text>
                    <View style={styles.pendingMeta}>
                      <View style={styles.pendingBadge}>
                        <Text style={styles.pendingBadgeText}>{exercise.sets} Séries</Text>
                      </View>
                      <View style={styles.pendingBadge}>
                        <Text style={styles.pendingBadgeText}>{exercise.reps} Reps</Text>
                      </View>
                      {exercise.carga && (
                        <View style={styles.pendingBadge}>
                          <Text style={styles.pendingBadgeText}>{exercise.carga}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.playButton}>
                    {isCompleted ? (
                      <MaterialIcons name="check-circle" size={24} color="#13ec5b" />
                    ) : exercise.isActive ? (
                      <MaterialIcons name="play-arrow" size={24} color="#13ec5b" />
                    ) : (
                      <MaterialIcons name="play-arrow" size={24} color="#666" />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Tabela de Sets - Somente para exercício ativo */}
                {exercise.isActive && (
                  <View style={styles.setsContainer}>
                    <View style={styles.setsHeader}>
                      <Text style={[styles.setsHeaderText, {flex: 1}]}>SET</Text>
                      <Text style={[styles.setsHeaderText, {flex: 1.5}]}>KG</Text>
                      <Text style={[styles.setsHeaderText, {flex: 1.5}]}>REPS</Text>
                      <Text style={[styles.setsHeaderText, {flex: 2}]}>STATUS</Text>
                    </View>

                    {exercise.sets_data.map((set, index) => {
                      const isCurrentSet = !set.completed && 
                        exercise.sets_data.slice(0, index).every(s => s.completed);
                      
                      return (
                        <View
                          key={set.number}
                          style={[
                            styles.setRow,
                            set.completed && styles.setRowCompleted,
                            isCurrentSet && styles.setRowCurrent,
                          ]}
                        >
                          <View style={styles.setNumberContainer}>
                            <View style={[
                              styles.setNumber,
                              isCurrentSet && styles.setNumberActive,
                              set.completed && styles.setNumberDone,
                            ]}>
                              <Text style={[
                                styles.setNumberText,
                                (isCurrentSet || set.completed) && styles.setNumberTextActive,
                              ]}>
                                {set.number}
                              </Text>
                            </View>
                          </View>

                          {isCurrentSet ? (
                            <>
                              <View style={styles.inputContainer}>
                                <TextInput
                                  style={styles.setInput}
                                  value={set.weight.toString()}
                                  keyboardType="number-pad"
                                  onChangeText={(text) => {
                                    setExercises(prev =>
                                      prev.map(ex => {
                                        if (ex.id === exercise.id) {
                                          return {
                                            ...ex,
                                            sets_data: ex.sets_data.map(s =>
                                              s.number === set.number ? {...s, weight: text} : s
                                            ),
                                          };
                                        }
                                        return ex;
                                      })
                                    );
                                  }}
                                />
                              </View>
                              <View style={styles.inputContainer}>
                                <TextInput
                                  style={styles.setInput}
                                  value={set.reps.toString()}
                                  keyboardType="number-pad"
                                  onChangeText={(text) => {
                                    setExercises(prev =>
                                      prev.map(ex => {
                                        if (ex.id === exercise.id) {
                                          return {
                                            ...ex,
                                            sets_data: ex.sets_data.map(s =>
                                              s.number === set.number ? {...s, reps: parseInt(text) || 0} : s
                                            ),
                                          };
                                        }
                                        return ex;
                                      })
                                    );
                                  }}
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
                                  onPress={() => handleCompleteSet(exercise.id, set.number)}
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
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={{height: 120}} />
        </ScrollView>
      )}

      {/* Floating Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.cancelButton}
          activeOpacity={0.7}
          onPress={() => {
            console.log('🔴 BOTÃO CANCELAR CLICADO!');
            navigation.goBack();
          }}>
          <MaterialIcons name="cancel" size={24} color="#ef4444" />
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        {/* Botão Finalizar - sempre visível, salva divisão atual e volta */}
        <TouchableOpacity 
          style={[
            styles.finishButton,
            (!divisaoCompletada || finalizando) && styles.finishButtonDisabled
          ]}
          activeOpacity={0.7}
          disabled={!divisaoCompletada || finalizando}
          onPress={() => {
            console.log('🟢 BOTÃO FINALIZAR CLICADO!');
            
            // Suporte para Web e Mobile
            if (Platform.OS === 'web') {
              const confirmar = window.confirm(`Deseja finalizar a Divisão ${divisaoAtual}?`);
              if (confirmar) {
                handleFinalizarTreino();
              }
            } else {
              Alert.alert(
                `Finalizar Divisão ${divisaoAtual}`,
                'Deseja salvar e concluir esta divisão?',
                [
                  {
                    text: 'Cancelar',
                    style: 'cancel'
                  },
                  {
                    text: 'Finalizar',
                    onPress: handleFinalizarTreino
                  }
                ]
              );
            }
          }}>
          <MaterialIcons name="flag" size={24} color="#102216" />
          <Text style={styles.finishButtonText}>
            {finalizando ? 'Finalizando...' : divisaoCompletada ? 'Finalizar Treino' : 'Complete todos os exercícios'}
          </Text>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#13ec5b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#102216',
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
  divisaoIndicator: {
    marginTop: 16,
    marginBottom: 8,
  },
  divisaoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  divisoesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  divisaoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  divisaoChipActive: {
    backgroundColor: '#13ec5b',
    borderColor: '#13ec5b',
  },
  divisaoChipLocked: {
    opacity: 0.5,
  },
  divisaoChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92c9a4',
  },
  divisaoChipTextActive: {
    color: '#102216',
  },
  proximaDivisaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#13ec5b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: '#13ec5b',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  proximaDivisaoButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#102216',
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
  exerciseCard: {
    borderRadius: 16,
    backgroundColor: '#1a3322',
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  exerciseCardHeader: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
    alignItems: 'center',
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
  exerciseIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: 'rgba(19,236,91,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
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
    position: 'relative',
  },
  activeExerciseCardBorder: {
    borderWidth: 2,
    borderColor: '#13ec5b',
  },
  completedExerciseCard: {
    opacity: 0.6,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#666',
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
    backgroundColor: '#102216',
    borderTopWidth: 1,
    borderTopColor: 'rgba(19,236,91,0.1)',
    zIndex: 1000,
    elevation: 10,
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
  finishButtonDisabled: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#102216',
  },
});
