import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { postFeira } from '../servicos/FeiraServico';

export default function FormularioFeira() {
  const navigation = useNavigation();
  const [feira, setFeira] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!feira.dsFeira.trim()) {
      Alert.alert('Atenção', 'Informe a descrição da feira.');
      return;
    }

    try {
      setLoading(true);
      await postFeira(feira);
      Alert.alert('Sucesso', 'Feira cadastrada com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a feira: '+error);
    }finally{
      setLoading(false);
    }
  };

  const handleFeiraChange = (field, value) => {
    setFeira({
      ...feira,
      [field]: value
    });
  };

  const handleVoltar = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de feira</Text>

      <TextInput
        placeholder="Descrição da vigência"
        style={styles.input}
        value={feira.dsFeira}
        onChangeText={(text) => handleFeiraChange('dsFeira', text)}
      />

      <View style={styles.buttonRow}>
        <Button title="Salvar" onPress={handleSalvar} />
        <Button title="Voltar" onPress={handleVoltar} />
      </View>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Processando...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingLogo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
});
