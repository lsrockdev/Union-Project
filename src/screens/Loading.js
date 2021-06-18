import React, {useEffect} from 'react';
import {Text, Image, View, StyleSheet} from 'react-native';
import {theme} from '../services/Common/theme';
import {CommonActions} from '@react-navigation/native';
import {useStateValue} from '../services/State/State';
import {reducer, actions} from '../services/State/Reducer';
import {useSelector} from 'react-redux';
import '../../global';
import '../../shim';
import Web3 from 'web3';
import {ganachehost, rinkeby} from '../web3/constants';
import {
  setAuthToken,
  getAuthToken,
  getWalletData,
} from '../services/DataManager';

import {userLogin, userRegister, getNounce} from '../services/API/APIManager';

const Loading = ({navigation}) => {
  const web3 = useSelector((state) => state.web3);
  const [{authInfo}, dispatch] = useStateValue();

  const LoginProc = async () => {
    try {
      //register to check account
      var nounce = '';
      var signature = '';
      var access_token = '';
      var refresh_token = '';
      //check wallet
      let walletInfo = await getWalletData();
      if (walletInfo == null) {
        alert('Wallet not created!');
        return;
      }

      let registerResponse = await userRegister(walletInfo.publicKey);
      if (registerResponse && registerResponse.status == 'success') {
        //first time register
        nounce = registerResponse.nonce;
      } else {
        //already registered
        let nonceResponse = await getNounce(walletInfo.publicKey);
        nounce = nonceResponse.nonce;
      }

      //web3 initialization - currently redux weird implementation
      //let web3 = new Web3(new Web3.providers.HttpProvider(rinkeby))

      let Web3 = web3.web3Instance;
      let sign = Web3.eth.accounts.sign(
        Web3.utils.utf8ToHex(nounce.toString()),
        walletInfo.privateKey,
      );
      if (sign && sign.signature) {
        signature = sign.signature;

        let loginResponse = await userLogin(walletInfo.publicKey, signature);

        if (
          loginResponse &&
          loginResponse.access_token &&
          loginResponse.refresh_token
        ) {
          if (loginResponse) {
            await setAuthToken({
              refresh_token: loginResponse.refresh_token,
              access_token: loginResponse.access_token,
            });
          }
          return loginResponse;
        }
      }
    } catch (err) {
      console.log('err LoginProc', err);
    }
    return null;
  };

  useEffect(() => {
    LoginProc();

    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
    }, 2000);
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
        style={styles.image}
        resizeMode="stretch"
        source={require('../assets/icon.png')}
      />
      <View style={styles.creatingWallet}>
        <Text
          style={{
            color: theme.APP_COLOR,
            fontFamily: 'Inter-Regular',
            fontSize: 19,
            fontWeight: '600',
          }}>
          Powered by:
        </Text>
      </View>
      <Image
        style={styles.image}
        resizeMode="contain"
        source={require('../assets/ocean.png')}
      />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  image: {
    height: 60,
    width: 110,
  },
  creatingWallet: {
    marginTop: 70,
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#F3F0F3',
  },
});
