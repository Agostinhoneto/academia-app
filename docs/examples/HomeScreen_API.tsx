// EXEMPLO: Como atualizar HomeScreen para usar API real

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialIcons} from '@expo/vector-icons';
import {useAuth} from '../contexts/AuthContext';
import {treinoService} from '../services/treino';
import {mensalidadeService} from '../services/mensalidade';

export default function HomeScreen({navigation}: any) {
  const {user, aluno} = useAuth();
  const [treinos, setTreinos] = useState([]);
  const [proximaMensalidade, setProximaMensalidade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      
      // Buscar dados em paralelo
      const [treinosData, mensalidadeData] = await Promise.all([
        treinoService.getTreinos(),
        mensalidadeService.getProximaMensalidade(),
      ]);
      
      setTreinos(treinosData);
      setProximaMensalidade(mensalidadeData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#13ec5b" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </Text>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        
        {/* Próxima Mensalidade */}
        {proximaMensalidade && (
          <View style={styles.mensalidadeCard}>
            <Text style={styles.mensalidadeLabel}>Próxima Mensalidade</Text>
            <Text style={styles.mensalidadeValor}>
              R$ {proximaMensalidade.valor.toFixed(2)}
            </Text>
            <Text style={styles.mensalidadeVencimento}>
              Vence em {proximaMensalidade.dias_para_vencimento} dias
            </Text>
          </View>
        )}

        {/* Lista de Treinos */}
        <Text style={styles.sectionTitle}>Meus Treinos</Text>
        {treinos.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum treino cadastrado</Text>
        ) : (
          treinos.map((treino) => (
            <TouchableOpacity
              key={treino.id}
              style={styles.treinoCard}
              onPress={() => navigation.navigate('WorkoutActive', {treino})}>
              <Text style={styles.treinoNome}>{treino.nome}</Text>
              <Text style={styles.treinoDescricao}>{treino.descricao}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos...
