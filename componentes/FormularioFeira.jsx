import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { postFeira } from '../servicos/FeiraServico';

export default function FormularioFeira() {
  const navigation = useNavigation();
  const [feira, setFeira] = useState('');

  const handleSalvar = async () => {
    if (!feira.dsFeira.trim()) {
      Alert.alert('Atenção', 'Informe a descrição da feira.');
      return;
    }

    try {
      await postFeira(feira);
      Alert.alert('Sucesso', 'Feira cadastrada com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a feira: '+error);
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
});
