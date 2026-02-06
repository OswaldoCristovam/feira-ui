import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { deleteItemFeira, getFeiraValorAnterior, getItemFeira, postItemFeira, putItemFeira } from '../servicos/FeiraServico';
import { getProduto } from '../servicos/ProdutosServico';

export default function ItemFeira() {
  const route = useRoute();
  const navigation = useNavigation();
  const { cdProduto, dsProduto, cdFeira } = route.params;
  const [produto, setProduto] = useState('');
  const [itemFeira, setItemFeira] = useState('');
  const [anterior, setAnterior] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarProduto();
    carregarItemFeira();
  }, []);

  useEffect(() => {
    if (itemFeira && itemFeira.vlProduto && itemFeira.qtProduto) {
        carregarValor();
    }
  }, [itemFeira]);

  async function carregarProduto() {
    try {
      const response = await getProduto(cdProduto);
      setProduto(response);
    } catch (err) {
      console.error('Erro ao carregar produto[codigo]: ', err);
    }
  }

  async function carregarItemFeira() {
    try {
      setLoading(true);
      const response = await getItemFeira(cdFeira, cdProduto); // você precisa ter esse endpoint implementado
      setItemFeira(response);
    } catch (err) {
      console.error('Erro ao carregar item da feira: ', err);
    }finally{
      setLoading(false);
    }
  }

  async function carregarValor() {
    if (!anterior || !itemFeira?.vlProduto){
      try {
        setLoading(true);
        const response = await getFeiraValorAnterior(cdFeira, cdProduto);
        setAnterior(response);
      } catch (err) {
        console.error('Erro ao carregar valor anterior do item: ', err);
      }finally{
        setLoading(false);
      }
    }
  }

  const renderImage = () => {
    const url = `https://serverapi.tail6fa2aa.ts.net/feira/api/produtos/${cdProduto}/imagem`;

    return (
      <Image
        source={{ uri: url }}
        style={styles.image}
        resizeMode="contain"
      />
    );
  };

  const handleChange = (campo, valor) => {
    setItemFeira({ ...itemFeira, [campo]: valor });

  };

  const handleSalvar = async () => {
    try{
      setLoading(true);
      if(itemFeira.cdItFeira !== undefined){
        await putItemFeira(cdFeira, cdProduto, itemFeira);
      }else{
        await postItemFeira(cdFeira, cdProduto, itemFeira);
      }
    } catch (err) {
      alert('Erro ao atualizar Produto: '+ err);
    }finally{
      setLoading(false);
    }
    
  };

  const handleVoltar = () => {
    navigation.goBack();
  };

  const handleRemover = async () => {
    try{
      setLoading(true);
      await deleteItemFeira(cdFeira, cdProduto);
    } catch (err) {
      alert('Erro ao adicionar Produto: '+err);
    }finally{
      setLoading(false);
    }
  };

    const comparacao = () => {
      if (itemFeira.vlProduto - anterior.vlProduto > 0) {
        return `Mais caro R$ ${Math.abs((itemFeira.vlProduto - anterior.vlProduto)).toFixed(2).replace('.', ',')}`;
      }else{
        return `Mais barato R$ ${Math.abs((itemFeira.vlProduto - anterior.vlProduto)).toFixed(2).replace('.', ',')}`;
      }
    };

  if (!produto || !itemFeira){ 
    return (
      <View>{loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Processando...</Text>
        </View>
        )}
      </View>
      );
    }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Imagem */}
      {renderImage()}
      <Text>
        {dsProduto}
      </Text>
        
      
      {/* Campos */}
      <TextInput
        placeholder="Quantidade"
        value={itemFeira.qtProduto?.toString() ?? ''}
        onChangeText={(text) => handleChange('qtProduto', text)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Preço"
        value={itemFeira.vlProduto?.toString() ?? ''}
        onChangeText={(text) => handleChange('vlProduto', text)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Total"
        value={`Total R$ ${((itemFeira.vlProduto ?? 0) * (itemFeira.qtProduto ?? 0)).toFixed(2).replace('.', ',')}`}
        editable={false}
        style={styles.input}
      />

      {/* Texto comparativo */}
      <Text style={styles.infoText}>
        Em comparação com o mês anterior o produto ficou...
      </Text>
      <TextInput
        value={anterior ? comparacao() : 'Insira a quantidade e o valor!'} // Você pode calcular dinamicamente se tiver os dados
        editable={false}
        style={styles.input}
      />

      {/* Botões Salvar, Excluir e Voltar */}
      <View style={styles.view}>
        <TouchableOpacity style={styles.buttonRow} onPress={handleSalvar}>
            <Text style={styles.removeText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeButton} onPress={handleRemover}>
            <Text style={styles.removeText}>Excluir da feira atual?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonRow} onPress={handleVoltar}>
            <Text style={styles.removeText}>Voltar</Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Processando...</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 280,
    marginBottom: 16,
  },
  input: {
    width: '90%',
    backgroundColor: '#ddd',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  infoText: {
    marginBottom: 8,
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#ff4d4d', // vermelho
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flex: 1,
    alignItems: 'center',
  },
  removeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonRow: {
    backgroundColor: '#4169e1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flex: 1,
    alignItems: 'center',
  },
  view:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 20,
    height: 70,
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
