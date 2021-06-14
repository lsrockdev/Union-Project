/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import './global'
import './shim'
import React, {Component} from 'react'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Provider } from 'react-redux'
import { persistStore } from "redux-persist"
import { PersistGate } from 'redux-persist/integration/react';
import Home from './src/WalletHome'
import WalletSettings from './src/screens/WalletSettings'
import WalletActions from './src/screens/WalletActions'
import { store } from './src/store/store.js'
import { getWeb3_} from './src/web3/getWeb3'


const Stack = createStackNavigator()
const persistor = persistStore(store);

getWeb3_.catch(
  err => console.warn('Error in web3 initialization.', err)
)



export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {

        return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Stack.Navigator>
            <Stack.Screen name="WalletHome" component={Home} options={{ title: 'Wallet Settings' }} />
            <Stack.Screen name="My Wallet" component={WalletActions} navigation={this.props.navigation} />
            <Stack.Screen name="Wallet" component={WalletSettings} navigation={this.props.navigation} />
          </Stack.Navigator>
        </PersistGate>
      </Provider>
    )
  }
}
