// src/services/ProdutosService.js
import Api from './Api';

export async function getProdutos(filtro) {
  try {
    const response = await Api.get(`/feira/api/produtos/descricao/${filtro}`);

    return response.data;
  } catch (error) {
    console.error('Erro ao carregar produtos[descricao]: '+error.response.data.message);
    throw error;
  }
}

export async function getProdutoPorCodigoBarras(cdCodigoBarras) {
  try {
    const response = await Api.get(`/feira/api/produtos/codigoBarras/${cdCodigoBarras}`);
    return response.data;
  } catch (error) {
    
  }
}

export async function getProduto(cdProduto) {
    try {
      const response = await Api.get(`/feira/api/produtos/${cdProduto}`);
      return response.data;
    } catch (error) {
      alert('Erro ao carregar produtos[codigo]: ' + error.response.data.message);
    }
  }

  export async function putProdutos(produto) {
    try {
      const response = await Api.put('/feira/api/produtos', produto);
      alert(response.data);
    } catch (error) {
      alert('Erro ao atualizar produtos: ' + error.response.data.message);
    }
  }

export async function postProdutos(produto) {
    try {
      const response = await Api.post('/feira/api/produtos', produto);
      alert(response.data);
    } catch (error) {
      alert('Erro ao salvar produtos: ' + error.response.data.message);
    }
  }
