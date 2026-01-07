import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORICO_KEY = '@academia:treino_historico';

export interface TreinoExecucao {
  treinoId: number;
  divisao: string; // A, B, C, etc
  dataHora: string; // ISO string
  concluido: boolean;
}

export const treinoHistoricoService = {
  /**
   * Salva a execução de uma divisão de um treino
   */
  async salvarExecucao(treinoId: number, divisao: string): Promise<void> {
    try {
      console.log(`📝 Salvando execução: Treino ${treinoId}, Divisão ${divisao}`);
      const historico = await this.getHistorico();
      console.log('📚 Histórico atual:', historico.length, 'execuções');
      
      const novaExecucao: TreinoExecucao = {
        treinoId,
        divisao,
        dataHora: new Date().toISOString(),
        concluido: true,
      };
      
      historico.push(novaExecucao);
      console.log('➕ Nova execução adicionada:', novaExecucao);
      
      await AsyncStorage.setItem(HISTORICO_KEY, JSON.stringify(historico));
      console.log('✅ Execução salva no AsyncStorage');
    } catch (error) {
      console.error('❌ Erro ao salvar execução:', error);
      throw error;
    }
  },

  /**
   * Busca todo o histórico
   */
  async getHistorico(): Promise<TreinoExecucao[]> {
    try {
      const data = await AsyncStorage.getItem(HISTORICO_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Erro ao buscar histórico:', error);
      return [];
    }
  },

  /**
   * Verifica se uma divisão específica de um treino já foi feita HOJE
   */
  async foiFeitoHoje(treinoId: number, divisao?: string): Promise<boolean> {
    try {
      const historico = await this.getHistorico();
      const hoje = this.getDataAtual();
      
      const feitoHoje = historico.some(exec => {
        if (exec.treinoId !== treinoId || !exec.concluido) return false;
        if (divisao && exec.divisao !== divisao) return false;
        
        const dataExecucao = this.getDataFromISO(exec.dataHora);
        return dataExecucao === hoje;
      });
      
      console.log(`🔍 Treino ${treinoId} ${divisao ? `Divisão ${divisao}` : ''} foi feito hoje? ${feitoHoje}`);
      return feitoHoje;
    } catch (error) {
      console.error('❌ Erro ao verificar se foi feito hoje:', error);
      return false;
    }
  },

  /**
   * Retorna quais divisões de um treino foram feitas HOJE
   */
  async getDivisoesFeitasHoje(treinoId: number): Promise<string[]> {
    try {
      const historico = await this.getHistorico();
      const hoje = this.getDataAtual();
      
      const divisoesFeitas = historico
        .filter(exec => {
          if (exec.treinoId !== treinoId || !exec.concluido) return false;
          const dataExecucao = this.getDataFromISO(exec.dataHora);
          return dataExecucao === hoje;
        })
        .map(exec => exec.divisao);
      
      console.log(`📊 Divisões feitas hoje do treino ${treinoId}:`, divisoesFeitas);
      return divisoesFeitas;
    } catch (error) {
      console.error('❌ Erro ao buscar divisões feitas:', error);
      return [];
    }
  },

  /**
   * Determina a próxima divisão a ser feita (baseado na última divisão completada, independente do dia)
   */
  async getProximaDivisao(treinoId: number, divisoesDisponiveis: string[]): Promise<string | null> {
    try {
      if (!divisoesDisponiveis || divisoesDisponiveis.length === 0) {
        return null;
      }
      
      // Buscar última execução deste treino (independente do dia)
      const historico = await this.getHistorico();
      const execucoesTreino = historico
        .filter(exec => exec.treinoId === treinoId && exec.concluido)
        .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());
      
      if (execucoesTreino.length === 0) {
        // Nunca fez nenhuma divisão, começa pela primeira
        console.log(`🎯 Começando pelo início: ${divisoesDisponiveis[0]}`);
        return divisoesDisponiveis[0];
      }
      
      // Pegar a última divisão feita
      const ultimaDivisaoFeita = execucoesTreino[0].divisao;
      console.log(`🔍 Última divisão feita foi: ${ultimaDivisaoFeita}`);
      
      // Encontrar próxima divisão na sequência
      const indexAtual = divisoesDisponiveis.indexOf(ultimaDivisaoFeita);
      
      if (indexAtual === -1 || indexAtual === divisoesDisponiveis.length - 1) {
        // Se não encontrou ou é a última, volta para a primeira
        console.log(`🔄 Voltando para o início: ${divisoesDisponiveis[0]}`);
        return divisoesDisponiveis[0];
      }
      
      // Retorna a próxima divisão
      const proximaDivisao = divisoesDisponiveis[indexAtual + 1];
      console.log(`➡️ Próxima divisão: ${proximaDivisao}`);
      return proximaDivisao;
    } catch (error) {
      console.error('❌ Erro ao determinar próxima divisão:', error);
      return divisoesDisponiveis[0] || null;
    }
  },

  /**
   * Verifica se TODAS as divisões de um treino foram feitas hoje
   */
  async todasDivisoesFeitas(treinoId: number, divisoesDisponiveis: string[]): Promise<boolean> {
    try {
      const divisoesFeitas = await this.getDivisoesFeitasHoje(treinoId);
      const todasFeitas = divisoesDisponiveis.every(div => divisoesFeitas.includes(div));
      
      console.log(`🏁 Todas divisões do treino ${treinoId} feitas hoje? ${todasFeitas}`);
      return todasFeitas;
    } catch (error) {
      console.error('❌ Erro ao verificar divisões completas:', error);
      return false;
    }
  },

  /**
   * Busca a última execução de um treino
   */
  async getUltimaExecucao(treinoId: number): Promise<TreinoExecucao | null> {
    try {
      const historico = await this.getHistorico();
      const execucoes = historico
        .filter(exec => exec.treinoId === treinoId && exec.concluido)
        .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());
      
      return execucoes.length > 0 ? execucoes[0] : null;
    } catch (error) {
      console.error('❌ Erro ao buscar última execução:', error);
      return null;
    }
  },

  /**
   * Retorna a data atual no formato YYYY-MM-DD
   */
  getDataAtual(): string {
    const now = new Date();
    return this.formatarData(now);
  },

  /**
   * Extrai a data (YYYY-MM-DD) de uma ISO string
   */
  getDataFromISO(isoString: string): string {
    const date = new Date(isoString);
    return this.formatarData(date);
  },

  /**
   * Formata uma data para YYYY-MM-DD
   */
  formatarData(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Determina o próximo treino a ser feito (considera os já feitos hoje)
   */
  async getProximoTreinoDisponivel(treinos: any[]): Promise<number | null> {
    if (!treinos || treinos.length === 0) return null;

    // Filtrar treinos não feitos hoje
    const treinosDisponiveis = [];
    for (const treino of treinos) {
      const feitoHoje = await this.foiFeitoHoje(treino.id);
      if (!feitoHoje) {
        treinosDisponiveis.push(treino);
      }
    }

    if (treinosDisponiveis.length === 0) {
      console.log('✅ Todos os treinos foram feitos hoje!');
      return null;
    }

    // Retorna o treino do dia ou o primeiro disponível
    const treinoDoDia = this.getTreinoDoDia(treinosDisponiveis);
    return treinoDoDia;
  },

  /**
   * Limpa o histórico (útil para testes ou reset)
   */
  async limparHistorico(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HISTORICO_KEY);
      console.log('🗑️ Histórico limpo');
    } catch (error) {
      console.error('❌ Erro ao limpar histórico:', error);
    }
  },

  /**
   * Determina qual treino pode ser feito baseado no dia da semana
   * Retorna o ID do treino que deveria ser feito hoje
   */
  getTreinoDoDia(treinos: any[]): number | null {
    if (!treinos || treinos.length === 0) {
      console.log('⚠️ Nenhum treino disponível');
      return null;
    }

    const diasSemana = [
      'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
    ];
    
    const hoje = new Date();
    const diaSemanaHoje = diasSemana[hoje.getDay()];
    
    console.log(`📅 Hoje é ${diaSemanaHoje}`);
    
    // Procura um treino que corresponda ao dia de hoje
    const treinoDoDia = treinos.find(treino => 
      treino.dia_semana?.nome && treino.dia_semana.nome === diaSemanaHoje
    );
    
    if (treinoDoDia) {
      console.log(`✅ Treino do dia encontrado: ${treinoDoDia.nome}`);
      return treinoDoDia.id;
    }
    
    // FALLBACK: Se não há treino para hoje, retorna o próximo treino não feito
    console.log('⚠️ Nenhum treino programado especificamente para hoje');
    console.log('🔄 Procurando próximo treino disponível...');
    
    // Retorna o primeiro treino como sugestão
    if (treinos.length > 0) {
      console.log(`💡 Sugerindo treino: ${treinos[0].nome}`);
      return treinos[0].id;
    }
    
    return null;
  },

  /**
   * Calcula sequência de dias consecutivos treinando
   */
  async getSequenciaConsecutiva(): Promise<number> {
    try {
      const historico = await this.getHistorico();
      if (historico.length === 0) return 0;

      // Ordenar por data decrescente
      const execucoes = historico
        .filter(exec => exec.concluido)
        .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());

      if (execucoes.length === 0) return 0;

      // Obter datas únicas
      const datasUnicas = [...new Set(execucoes.map(e => this.getDataFromISO(e.dataHora)))];
      
      const hoje = this.getDataAtual();
      let sequencia = 0;
      
      // Verificar se treinou hoje
      if (datasUnicas[0] === hoje) {
        sequencia = 1;
        
        // Contar dias anteriores consecutivos
        for (let i = 1; i < datasUnicas.length; i++) {
          const dataAnterior = new Date(hoje);
          dataAnterior.setDate(dataAnterior.getDate() - i);
          const dataEsperada = this.formatarData(dataAnterior);
          
          if (datasUnicas[i] === dataEsperada) {
            sequencia++;
          } else {
            break;
          }
        }
      }
      
      return sequencia;
    } catch (error) {
      console.error('❌ Erro ao calcular sequência:', error);
      return 0;
    }
  },

  /**
   * Calcula tempo total de treinos em minutos
   */
  async getTempoTotalTreinos(): Promise<number> {
    try {
      const historico = await this.getHistorico();
      
      // Estimar 45 minutos por treino concluído
      const treinosConcluidos = historico.filter(exec => exec.concluido).length;
      return treinosConcluidos * 45;
    } catch (error) {
      console.error('❌ Erro ao calcular tempo total:', error);
      return 0;
    }
  },
};

