import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService, LoginCredentials, LoginResponse } from '../services/auth';
import { alunoService, AlunoProfile } from '../services/aluno';
import { tokenManager } from '../services/api';

interface AuthContextData {
  signed: boolean;
  loading: boolean;
  user: LoginResponse['user'] | null;
  aluno: LoginResponse['aluno'] | null;
  profile: AlunoProfile | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [aluno, setAluno] = useState<LoginResponse['aluno'] | null>(null);
  const [profile, setProfile] = useState<AlunoProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um token salvo ao iniciar o app
    async function loadStoragedData() {
      try {
        const token = await tokenManager.getToken();

        if (token) {
          // Tentar buscar o perfil do usuário
          const profileData = await alunoService.getProfile();
          setProfile(profileData);
          setUser(profileData.user as any);
          setAluno(profileData.aluno as any);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        // Token inválido, limpar
        await tokenManager.removeToken();
      } finally {
        setLoading(false);
      }
    }

    loadStoragedData();
  }, []);

  async function login(credentials: LoginCredentials) {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      // A API retorna apenas aluno, vamos usar como user também
      const userData = {
        id: response.aluno.id,
        name: response.aluno.nome,
        email: response.aluno.email,
        user_type: 'aluno',
        telefone: response.aluno.telefone,
        data_nascimento: response.aluno.data_nascimento,
        genero: response.aluno.genero,
      };
      
      setUser(userData as any);
      setAluno(response.aluno as any);
      setProfile(null);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setUser(null);
      setAluno(null);
      setProfile(null);
      setLoading(false);
    }
  }

  async function refreshProfile() {
    try {
      const profileData = await alunoService.getProfile();
      setProfile(profileData);
      setUser(profileData.user as any);
      setAluno(profileData.aluno as any);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        loading,
        user,
        aluno,
        profile,
        login,
        logout,
        refreshProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}
