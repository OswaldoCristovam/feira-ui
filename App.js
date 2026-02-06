import 'react-native-gesture-handler';
import React, { useState } from 'react';
import LoginScreen from './componentes/LoginScreen';
import { AuthContext } from './componentes/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Feira from './componentes/Feira';
import Produtos from './componentes/Produtos';
import FormularioProduto from './componentes/FormularioProduto';
import ItemFeira from './componentes/ItemFeira';
import FormularioFeira from './componentes/FormularioFeira';
import ScannerProduto from './componentes/ScannerProduto';

const Stack = createNativeStackNavigator();

export default function App() {
  const [logado, setLogado] = useState(false);

  return (
    <AuthContext.Provider value={{ logado, setLogado }}>
      {logado ? (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Inicial">
            <Stack.Screen name="Inicial" component={Feira} />
            <Stack.Screen name="Produtos" component={Produtos} />
            <Stack.Screen name="FormularioProduto" component={FormularioProduto} />
            <Stack.Screen name="ItemFeira" component={ItemFeira} />
            <Stack.Screen name="FormularioFeira" component={FormularioFeira} />
            <Stack.Screen name="ScannerProduto" component={ScannerProduto} />
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <LoginScreen onLoginSuccess={() => setLogado(true)} />
      )}
    </AuthContext.Provider>
  );
}
