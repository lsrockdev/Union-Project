import React, {useEffect} from 'react';
import {Text, Image, View, StyleSheet} from 'react-native';
import {theme} from '../services/Common/theme';
import {CommonActions} from '@react-navigation/native';
import {useStateValue} from '../services/State/State';
import {reducer, actions} from '../services/State/Reducer';

import '../../global'
import '../../shim'
import Web3 from 'web3'
import { ganachehost, rinkeby } from '../web3/constants'

import { setAuthToken, getAuthToken } from '../services/DataManager';



import {
  userLogin,
  userRegister,
  getNounce

} from '../services/API/APIManager';

const test_credential = {
  private_key: "0x4a4813d7a0123e01a096c5c2bbe35dbf104c1ff678affee9dce96ea870cd2fde",
  public_address: "0x6bbC8369eA068E038a6Db7Cd15c7136FFEE3f77d",
  public_key: ''
}





const Loading = ({navigation}) => {
  //const web3 = useSelector(state=>state.web3);
  const [{authInfo}, dispatch] = useStateValue();

  const LoginProc = async () => {
    try {
      //register to check account
      var nounce = "";
      var signature = "";
      var access_token = "";
      var refresh_token = "";

      let registerResponse = await userRegister(test_credential.public_address);
      if (registerResponse && registerResponse.status == "success"){
        //first time register
        nounce = registerResponse.nonce;
      }else {
        //already registered
        let nonceResponse = await getNounce(test_credential.public_address );
        nounce = nonceResponse.nonce; 
      }

      //web3 initialization - currently redux weird implementation
      let web3 = new Web3(new Web3.providers.HttpProvider(rinkeby))
      let sign = web3.eth.accounts.sign(web3.utils.utf8ToHex(nounce.toString()), test_credential.private_key)
      if(sign && sign.signature) {
        signature = sign.signature;

        let loginResponse = await userLogin(test_credential.public_address, signature);

        if (loginResponse && loginResponse.access_token && loginResponse.refresh_token) {
          if(loginResponse) {
            await setAuthToken({
              refresh_token: loginResponse.refresh_token,
              access_token: loginResponse.access_token
            });
          }
      
          return loginResponse;
        }
      }
    }catch(err) {
      console.log("err LoginProc", err);
    }
    return null;
  }

  
  
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
          Creating wallet...
        </Text>
      </View>
      <Text
        style={{
          color: theme.COLORS.WHITE,
          fontFamily: 'Inter-Regular',
          fontSize: 18,
          fontWeight: '300',
        }}>
        free. quickly. automatically.
      </Text>
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
