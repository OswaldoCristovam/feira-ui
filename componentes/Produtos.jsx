import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getFeira, getItensNaoPegos, putFeira } from '../servicos/FeiraServico';
import { getProdutoPorCodigoBarras, getProdutos, putProdutos } from '../servicos/ProdutosServico';

export default function Produtos() {
  const navigation = useNavigation();
  const route = useRoute();
  const { cdFeira, snAltera } = route.params;

  const [produtos, setProdutos] = useState([]);
  const [produtosNaoPegos, setProdutosNaoPegos] = useState([]);
  const [mostrarFaltantes, setMostrarFaltantes] = useState(false);
  const [limiteExibicao, setLimiteExibicao] = useState(6);
  const [feira, setFeira] = useState(null); // null inicialmente
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(false);

  // =========================================
  // useFocusEffect: carrega feira e trata scanner
  // =========================================
  useFocusEffect(
    useCallback(() => {
      const codigo = route.params?.codigoBarras;
      const modo = route.params?.modo;
      const cdProd = route.params?.cdProd;

      const executar = async () => {
        // Carrega feira e aguarda retorno
        const feiraCarregada = await carregaFeira();
        // Se veio do scanner, processa o código
        if (codigo) {
          await handleCodigoBarras(codigo, modo, cdProd);
          // Limpa os parâmetros para não disparar de novo
          navigation.setParams({ codigoBarras: undefined, modo: undefined, cdProd: undefined });
        }
      };

      executar();
    }, [route.params])
  );

  // =========================================
  // useEffect: filtro de produtos
  // =========================================
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProdutos([]);
      carregarProdutos(true);
    }, 400);

    return () => clearTimeout(timeout);
  }, [filtro]);

  // =========================================
  // Função para carregar produtos
  // =========================================
  async function carregarProdutos(reset = false) {
    if (loading) return;
    try {
      if(filtro){
        setLoading(true);
        const response = await getProdutos(filtro);
        setProdutos(prev => (reset ? response : [...prev, ...response]));
      }
    } catch (err) {
      Alert.alert('Erro ao carregas os produtos: '+err);
    } finally {
      setLoading(false);
    }
  }

  // =========================================
  // Função para carregar feira (retorna a feira carregada)
  // =========================================
  async function carregaFeira() {
    try {
      const response = await getFeira(cdFeira);
      setFeira(response);
      return response;
    } catch (err) {
      console.error('Erro ao carregar feira:', err);
      return null;
    }
  }

  // =========================================
  // Função para lidar com código de barras
  // =========================================
  const handleCodigoBarras = async (codigo, modo, cdProd) => {
    try {
      // Se feira não carregada, não prossegue

      if (modo === 'ATUALIZAR') {
        const produtoParaSalvar = { cdProduto: cdProd, cdCodigoBarras: codigo };
        await putProdutos(produtoParaSalvar);
        return;
      }

      // Caso seja apenas busca
      const produto = await getProdutoPorCodigoBarras(codigo);

      if (!produto) {
        Alert.alert('Produto não encontrado', 'Deseja cadastrar?', [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Cadastrar', onPress: () => navigation.navigate('FormularioProduto', { codigoBarras: codigo }) }
        ]);
        return;
      }

      navigation.navigate('ItemFeira', {
        cdProduto: produto.cdProduto,
        dsProduto: produto.dsProduto,
        cdFeira
      });
    } catch (err) {
      Alert.alert('Erro', 'Erro ao buscar produto: '+err);
    }
  };

  // =========================================
  // Função para alternar produtos faltantes
  // =========================================
  const naoPegos = async () => {
    try {
      if (!mostrarFaltantes) {
        const response = await getItensNaoPegos(cdFeira);
        setProdutosNaoPegos(response);
      }
      setMostrarFaltantes(prev => !prev);
    } catch (err) {
      console.error('Erro ao carregar produtos faltantes: ', err);
    }
  };

  const handlePesquisaChange = (text) => setFiltro(text);

  // =========================================
  // Filtragem dos produtos
  // =========================================
  const produtosFiltrados = useMemo(() => {
    const listaBase = mostrarFaltantes ? produtosNaoPegos : produtos;
    return listaBase
      .filter(produto => produto.dsProduto.toLowerCase().includes(filtro.toLowerCase()))
      .slice(0, limiteExibicao);
  }, [produtos, produtosNaoPegos, filtro, limiteExibicao, mostrarFaltantes]);

  const carregarMais = () => setLimiteExibicao(prev => prev + 6);

  const renderImage = (cdProduto) => {
    const url = `https://serverapi.tail6fa2aa.ts.net/feira/api/produtos/${cdProduto}/imagem`;
    return (
      <Image
        source={{ uri: url }}
        style={[styles.productImage, snAltera === 'S' && { opacity: 0.5 }]}
        defaultSource={require('../imagem/camera.jpg')}
      />
    );
  };

  const handleFinalizar = async () => {
    try {
      await putFeira(cdFeira);
      navigation.goBack();
    } catch (err) {
      console.error('Erro ao finalizar feira: ', err);
    }
  };

  const handleIrParaItemFeira = (cdProduto, dsProduto) => {
    if (snAltera === 'S') {
      alert('Essa feira já foi finalizada. Não é possível incluir ou editar os produtos.');
      return;
    }

    Alert.alert('Deseja atualizar este produto?', 'Escolha uma opção', [
      {
        text: 'Sim',
        onPress: () =>
          navigation.navigate('ScannerProduto', {
            returnTo: 'Produtos',
            modo: 'ATUALIZAR',
            cdProd: cdProduto
          })
      },
      {
        text: 'Não',
        onPress: () =>
          navigation.navigate('ItemFeira', { cdProduto, dsProduto, cdFeira })
      }
    ]);
  };

  const abrirScanner = () => {
    navigation.navigate('ScannerProduto', { returnTo: 'Produtos', modo: '', cdProd: '' });
  };

  // =========================================
  // Render
  // =========================================
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.box} onPress={() => navigation.navigate('FormularioProduto')}>
        <Text style={styles.buttonText}>Cadastrar Produto</Text>
      </TouchableOpacity>

      <Text style={styles.totalText}>
        Total da feira até o momento R$ {feira ? Number(feira.vlTotal).toFixed(2).replace('.', ',') : '0,00'}
      </Text>

      <TouchableOpacity style={styles.box} onPress={handleFinalizar}>
        <Text style={styles.buttonText}>Finalizar Feira</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.box} onPress={naoPegos}>
        <Text style={styles.buttonText}>
          {mostrarFaltantes ? 'Ver Todos os Produtos' : 'Produtos Faltantes'}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar por nome"
        value={filtro}
        onChangeText={handlePesquisaChange}
      />

      <TouchableOpacity style={styles.box} onPress={abrirScanner}>
        <Text style={styles.buttonText}>Ler Código de Barras</Text>
      </TouchableOpacity>

      <FlatList
        data={produtosFiltrados}
        keyExtractor={item => item.cdProduto}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => handleIrParaItemFeira(item.cdProduto, item.dsProduto)}>
              {renderImage(item.cdProduto)}
            </TouchableOpacity>
            <Text style={styles.productDescription}>
              {item.dsProduto.length > 20 ? item.dsProduto.substring(0, 20) + '...' : item.dsProduto}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.productList}
        onEndReached={carregarMais}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  totalText: {
    backgroundColor: '#ddd',
    padding: 12,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productImage: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  productList: {
    paddingBottom: 100,
  },
  box: {
    backgroundColor: '#ddd',
    padding: 16,
    marginVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
  },
});
