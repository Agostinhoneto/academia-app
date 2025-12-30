import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Pressable,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MaterialIcons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';

export default function LoginScreen({navigation}: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Implementar lógica de login
    console.log('Login:', email, password);
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com Imagem */}
        <View style={styles.headerContainer}>
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
            }}
            style={styles.headerImage}
            resizeMode="cover">
            <LinearGradient
              colors={['transparent', 'rgba(16,34,22,0.5)', '#102216']}
              style={styles.gradient}
            />
            
            {/* Botão Voltar */}
            <SafeAreaView edges={['top']} style={styles.topBar}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
            </SafeAreaView>
          </ImageBackground>
        </View>

        {/* Conteúdo Principal */}
        <View style={styles.content}>
          {/* Título */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Bem-vindo{'\n'}de volta</Text>
            <Text style={styles.subtitle}>Faça login para acessar seu treino.</Text>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            {/* Campo Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-mail ou Usuário</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons 
                  name="mail" 
                  size={24} 
                  color="#92c9a4" 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="exemplo@email.com"
                  placeholderTextColor="rgba(146,201,164,0.5)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Campo Senha */}
            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Senha</Text>
              </View>
              <View style={styles.inputWrapper}>
                <MaterialIcons 
                  name="lock" 
                  size={24} 
                  color="#92c9a4" 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={[styles.input, styles.inputWithButton]}
                  placeholder="********"
                  placeholderTextColor="rgba(146,201,164,0.5)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons 
                    name={showPassword ? 'visibility' : 'visibility-off'} 
                    size={24} 
                    color="#92c9a4" 
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
              </TouchableOpacity>
            </View>

            {/* Botão Entrar */}
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>ENTRAR</Text>
            </TouchableOpacity>
          </View>

          {/* Divisor com Social Login */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Ou continue com</Text>
            <View style={styles.divider} />
          </View>

          {/* Botões Social Login */}
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <MaterialIcons name="android" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <MaterialIcons name="apple" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Footer - Cadastro */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Ainda não tem conta?{' '}
              <Text style={styles.signupText}>Cadastre-se</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#102216',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    width: '100%',
    height: 280,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: -40,
    zIndex: 20,
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 38,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#92c9a4',
  },
  form: {
    gap: 20,
    marginBottom: 32,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: 56,
    backgroundColor: '#193322',
    borderWidth: 1,
    borderColor: '#326744',
    borderRadius: 12,
    paddingLeft: 48,
    paddingRight: 16,
    fontSize: 16,
    color: '#fff',
  },
  inputWithButton: {
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    width: 40,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#13ec5b',
    fontWeight: '500',
  },
  loginButton: {
    height: 56,
    backgroundColor: '#13ec5b',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#13ec5b',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#102216',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#326744',
  },
  dividerText: {
    fontSize: 14,
    color: '#92c9a4',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#193322',
    borderWidth: 1,
    borderColor: '#326744',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#92c9a4',
  },
  signupText: {
    color: '#13ec5b',
    fontWeight: 'bold',
  },
});
