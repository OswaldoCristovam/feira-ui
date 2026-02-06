import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useContext, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getFeiras } from '../servicos/FeiraServico';
import { AuthContext } from './AuthContext';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    box: {
      backgroundColor: '#ddd',
      padding: 16,
      marginVertical: 10,
      borderRadius: 8,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 8,
    },
    listItem: {
      fontSize: 16,
      marginVertical: 2,
    },
    buttonText: {
      textAlign: 'center',
      fontSize: 16,
    },
    picker: {
      height: 50,
      width: '100%',
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

export default function Feira() {
  const { setLogado } = useContext(AuthContext);
  const navigation = useNavigation();
  const [feiras, setFeiras] = useState([]);
  const [feiraSelecionada, setFeiraSelecionada] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
  useCallback(() => {
    carregarFeiras();
  }, []));

  async function carregarFeiras() {
    try {
      setLoading(true);
      const response = await getFeiras();
      setFeiras(response);
    } catch (err) {
      console.error('Erro ao carregar feiras: ', err);
    }finally{
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* 2. Cadastrar Feira */}
      <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('FormularioFeira')}>
        <Text style={styles.buttonText}>Cadastrar Feira</Text>
      </TouchableOpacity>

      {/* 1. Lista de Feiras */}
      <View style={styles.box}>
        <Text style={styles.title}>Vigência</Text>
        <Picker style={styles.picker}
            selectedValue={feiraSelecionada?.cdFeira ?? null}

            onValueChange={(valorSelecionado) => {
                const feira = feiras.find((f) => f.cdFeira === Number(valorSelecionado));
                setFeiraSelecionada(feira);
            }}
              
        >
            <Picker.Item label="Selecione..." value="" />
            {feiras.map((feira) => (
            <Picker.Item
                key={feira.cdFeira}
                label={feira.dsFeira}
                value={feira.cdFeira}
            />
            ))}
        </Picker>
        </View>

      {/* 2. Botão Iniciar Feira */}
      <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('Produtos', { cdFeira: feiraSelecionada.cdFeira, snAltera: feiraSelecionada.snFinalizada })}>
        <Text style={styles.buttonText}>Iniciar Feira</Text>
      </TouchableOpacity>

      {/* 3. Texto Total */}
      <View style={styles.box}>
        {feiraSelecionada?.vlTotal != null ? (
        <Text style={styles.buttonText}>
            A feira deu um total de R$ {Number(feiraSelecionada.vlTotal).toFixed(2).replace('.', ',')}
        </Text>
        ) : (
        <Text style={styles.buttonText}>Selecione uma feira para ver o total</Text>
        )}
      </View>
      <TouchableOpacity
        style={[styles.box, { backgroundColor: '#ff4d4d' }]}
        onPress={async () => {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('email');
            setLogado(false);
        }}
        >
        <Text style={[styles.buttonText, { color: 'white', fontWeight: 'bold' }]}>Sair</Text>
      </TouchableOpacity>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Processando...</Text>
        </View>
      )}
    </View>
  );
}
