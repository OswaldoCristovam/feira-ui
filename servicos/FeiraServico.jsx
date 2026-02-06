// src/services/FeiraService.js
import Api from './Api';

export async function getFeira(cdFeira) {
    try {
      const response = await Api.get(`/feira/api/feira/${cdFeira}`);
      return response.data;
    } catch (error) {
      alert('Erro ao carregar feira: ' + error.response.data.message);
    }
  }

export async function getFeiras() {
  try {
    const response = await Api.get('/feira/api/feira');
    return response.data;
  } catch (error) {
    alert('Erro ao carregar as feiras: ' + error.response.data.message);
  }
}

export async function getFeiraValorAnterior(cdFeira, cdProduto) {
    try {
      const response = await Api.get(`/feira/api/feira/${cdFeira}/produto/${cdProduto}/valorAnterior`);
      return response.data;
    } catch (error) {
      alert('Erro ao carregar valor anterior do item: ' + error.response.data.message);
    }
  }

export async function getItemFeira(cdFeira, cdProduto) {
    try {
      const response = await Api.get(`/feira/api/feira/${cdFeira}/produto/${cdProduto}`);
      return response.data;
    } catch (error) {
      alert('Erro ao carregar o item da feira: ' + error.response.data.message);
    }
}

export async function getItensNaoPegos(cdFeira) {
    try {
      const response = await Api.get(`/feira/api/feira/${cdFeira}/produtosNaoPegos`);
      return response.data;
    } catch (error) {
      alert('Erro ao carregar os itens não pegos da feira anterior: ' + error.response.data.message);
    }
}

export async function putFeira(cdFeira) {
    try {
      const response = await Api.put(`/feira/api/feira/${cdFeira}`);
      alert(response.data);
    } catch (error) {
      alert('Erro ao atualizar feira: ' + error.response.data.message);
    }
}

export async function putItemFeira(cdFeira, cdProduto, feira) {
    try {
      const response = await Api.put(`/feira/api/feira/${cdFeira}/produto/${cdProduto}`, feira);
      alert(response.data);
    } catch (error) {
      alert('Erro ao atualizar o item da feira: ' + error.response.data.message);
    }
}

export async function postItemFeira(cdFeira, cdProduto, feira) {
    try {
        const response = await Api.post(`/feira/api/feira/${cdFeira}/produto/${cdProduto}`, feira);
        alert(response.data);
    } catch (error) {
        alert('Erro ao salvar o item da feira: ' + error.response.data.message);
    }
}

export async function postFeira(feira) {
    try {
        const response = await Api.post(`/feira/api/feira`, feira);
        alert(response.data);
    } catch (error) {
        alert('Erro ao salvar feira: ' + error.response.data.message);
    }
}

export async function deleteItemFeira(cdFeira, cdProduto) {
    try {
      const response = await Api.delete(`/feira/api/feira/${cdFeira}/produto/${cdProduto}`);
      alert(response.data);
    } catch (error) {
      alert('Erro ao deletar item da feira: ' + error.response.data.message);
    }
}