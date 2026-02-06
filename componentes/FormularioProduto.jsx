import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { postProdutos } from '../servicos/ProdutosServico';

export default function FormularioProduto() {
  const navigation = useNavigation();

  const route = useRoute();

  const codigoLido = route.params?.codigoBarras;

  const [produto, setProduto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null);

  useEffect(() => {
    if (codigoLido) {
      setProduto({ ...produto, ['cdCodigoBarras']: codigoLido });
    }
  }, [codigoLido]);

  const abrirCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      alert('Permissão da câmera é necessária.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      base64: true,
      allowsEditing: false,
      aspect: [3,4],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {

        const base64 = result.assets[0].base64;
        
        // salva no estado como base64
        setImagem(`data:image/jpeg;base64,${base64}`);
      }
  };

  const salvar = async () => {
    try {
        const imagemSemPrefixo = imagem.replace(/^data:image\/\w+;base64,/, '');
        const produtoParaSalvar = {
          ...produto,
          blImagem: imagemSemPrefixo
        };
        await postProdutos(produtoParaSalvar);
      setProduto({ dsProduto: '', blImagem: '', cdCodigoBarras: '' });
    } catch (err) {
      alert('Erro ao adicionar Produto: '+err);
    }
  };

  const handleProdutoChange = (field, value) => {
    setProduto({
      ...produto,
      [field]: value
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {imagem ? (
        <Image source={{ uri: imagem }} style={styles.imagePreview} />
      ) : (
        <TouchableOpacity onPress={abrirCamera} style={styles.cameraButton}>
          <Text style={styles.cameraText}>Tirar foto do produto</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.barcodeText}>
        {`Código de barras: ${produto.cdCodigoBarras ? produto.cdCodigoBarras : ''}`}
      </Text>

      <TextInput
        placeholder="Descrição do produto"
        style={styles.input}
        value={produto.dsProduto}
        onChangeText={(text) => handleProdutoChange('dsProduto', text)}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={salvar}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      padding: 20,
      alignItems: 'center',
    },
    imagePreview: {
      width: '100%',
      height: 500,
      marginBottom: 20,
      borderRadius: 10,
      resizeMode: 'cover',
    },
    cameraButton: {
      width: '100%',
      height: 500,
      borderRadius: 10,
      backgroundColor: '#ccc',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    cameraText: {
      fontSize: 18,
      color: '#333',
    },
    input: {
      width: '100%',
      height: 50,
      borderColor: '#aaa',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 20,
    },
    buttonContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    saveButton: {
      backgroundColor: 'green',
      padding: 14,
      borderRadius: 8,
      flex: 1,
      marginRight: 10,
    },
    cancelButton: {
      backgroundColor: 'gray',
      padding: 14,
      borderRadius: 8,
      flex: 1,
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    barcodeButton: {
      width: '100%',
      height: 50,
      borderRadius: 8,
      backgroundColor: '#ddd',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    barcodeText: {
      fontSize: 16,
      color: '#333',
    },
  });