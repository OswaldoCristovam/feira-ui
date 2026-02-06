// src/api/Api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Api = axios.create({
  baseURL: 'https://serverapi.tail6fa2aa.ts.net', // Defina seu IP/backend aqui
});

// Interceptador para adicionar token e email
Api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    const email = await AsyncStorage.getItem('email');

    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (email) config.headers['X-User-Email'] = email;

    return config;
  },
  (error) => Promise.reject(error)
);

export default Api;
