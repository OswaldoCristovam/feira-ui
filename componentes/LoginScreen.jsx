import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import Api from '../servicos/Api';

export default function LoginScreen({ onLoginSuccess }) {
  const [dsEmail, setDsEmail] = useState('');
  const [dsSenha, setDsSenha] = useState('');

  const fazerLogin = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('email');
      const token1 = await AsyncStorage.getItem('token');
      const email = await AsyncStorage.getItem('email');

      const response = await Api.post('/feira/api/auth/login', {
        dsEmail,
        dsSenha
      });

      const token = response.data.token;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('email', dsEmail);

      onLoginSuccess(); // chama função de callback para trocar tela
    } catch (error) {
      Alert.alert('Erro', `Teste! ${JSON.stringify(error)}`);
      Alert.alert('Erro', `Login inválido! ${error.response.data.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={dsEmail}
        onChangeText={setDsEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={dsSenha}
        onChangeText={setDsSenha}
        secureTextEntry
      />
      <Button title="Entrar" onPress={fazerLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  titulo: { fontSize: 24, marginBottom: 20, textAlign: 'center' }
});
