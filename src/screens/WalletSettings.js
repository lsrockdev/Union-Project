//import '../../shim.js'
import React, {Component} from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput} from 'react-native'
import {connect} from "react-redux"
import { STPupdateAccounts, STPupdateSeedPhrase } from '../actions/actions.js'
import * as Utils from '../web3/utils'
import Dialog from "react-native-dialog"
import lightwallet from 'eth-lightwallet'
import bip39 from 'react-native-bip39'
import { hdPathString, localStorageKey } from '../web3/constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Button from '../components/Button';
import {theme} from '../services/Common/theme';

class WalletSettings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isConnected: false,
      accountAddress: '',
      newdialogVisible: false,
      restoredialogVisible: false,
    };
    this.web3 = null
    this.networktype = 'none'
    this.wallet = ""

    const web3Returned = setInterval(() => {
      if (this.props.web3 != null) {
        clearInterval(web3Returned);
        this.web3 = this.props.web3.web3Instance
        //console.log(this.web3)
        Utils.checkNetwork(this.web3).then((res) => {
          console.log(res)
          if (res == 'local' || res == 'rinkeby') {
            this.setState({
              isConnected: true,
            })
          }
        })
        try {
          console.log('check account')
          Utils.checkAccount(this.web3, this.props.STPupdateAccounts);
          //console.log(this.props.account)
        } catch (err) {
          console.error('error', err);
        }
      }
    },1000)
  }

  handleNewAccount = () => {
    (Utils.createAccFunc(this.web3, this.props.STPupdateAccounts)).then(res => {
      this.wallet = res
    });
    let salt = "salt"
    let seedPhrase = ""
    let ks = {}

    const saveWallet = async (walletdump) => {
      console.log('saving Wallet...')
      await AsyncStorage.setItem(localStorageKey, JSON.stringify(walletdump));
    };
    
    try {
      bip39.generateMnemonic(128).then((mnemonic) => {
        seedPhrase = mnemonic
        Utils.updateSeedPhrase(seedPhrase, this.props.STPupdateSeedPhrase)
      })  

      let arr = new Uint8Array(20);
      crypto.getRandomValues(arr);
      let password = btoa(String.fromCharCode(...arr)).split('').filter(value => {
          return !['+', '/' ,'='].includes(value);
        }).slice(0,10).join('');

      this.password = password;
      const opt = { password, seedPhrase, hdPathString, salt
    };

    lightwallet.keystore.createVault(opt, (err, data) => {
      if (err)
        console.warn(err)
      ks = data
      const walletdump = { ver: '1', ks: ks.serialize(), }
      saveWallet(walletdump)
    })
    }
    catch(err){console.log(err)}
    console.log({seedphrase: seedPhrase ,ksvault: ks, cryptopass: this.password,  })
   return this.wallet
  }

  render() {
    
    return (
      <ScrollView  showsVerticalScrollIndicator={true}>
      <View style={styles.container}>
        <Text>{this.state.isConnected?'Connected to rinkeby node':'Not Connected'}</Text>
        <View style={{marginTop: '8%'}}>
        <Text style={styles.bigTextView} >{this.props.seedPhrase?'Mnemonic Phrase':''}</Text>
        <TextInput 
          selectable={true}
          selectTextOnFocus={true}
          value={this.props.seedPhrase}
        />
        <View ><Text></Text></View>
        <Text style={styles.bigTextView} >Public Key</Text>
        <TextInput 
          selectable={true}
          selectTextOnFocus={true}
          value={this.props.account}
          editable={true}
        />
        <View ><Text></Text></View>
        <Text style={styles.bigTextView} >Private Key</Text>
        <TextInput 
          selectable={true}
          selectTextOnFocus={true}
          value={this.wallet.privateKey}
        />
        <View ><Text></Text></View>
        <Text style={styles.bigTextView} >Password</Text>
        <TextInput 
          selectable={true}
          selectTextOnFocus={true}
          value={this.password}
        />
        <View ><Text></Text></View>
      </View>
      <View>
      { this.props.account && (this.props.account).length > 0?
        <Button
          color="#f2f2f2"
        title="More"
        buttonStyle={{
          borderRadius: 25,
          width: '70%',
          alignSelf: 'center',
        }}
        onPress={() => this.props.navigation.navigate('My Wallet',
        { password: this.password,
          address: this.props.account,
          seedPhrase: this.props.seedPhrase,
          privateKey: this.wallet.privateKey
        })}
        textStyle={{
          fontSize: 19,
          fontWeight: '600',
          color: theme.APP_COLOR,
          fontFamily: 'Inter-Bold',
        }}
        /> : <Text></Text>
      }
       </View>
      
        <Button
          color="#f2f2f2"
          title="New Wallet"
          buttonStyle={{
            borderRadius: 25,
            width: '70%',
            alignSelf: 'center',
          }}
          onPress={this.handleNewAccount}
          textStyle={{
            fontSize: 19,
            fontWeight: '600',
            color: theme.APP_COLOR,
            fontFamily: 'Inter-Bold',
          }}
        />
        <Button
          color="#f2f2f2"
          title="Delete Wallet"
          buttonStyle={{
            borderRadius: 25,
            width: '70%',
            alignSelf: 'center',
          }}
          onPress={() => alert('Pressed')}
          textStyle={{
            fontSize: 19,
            fontWeight: '600',
            color: "#FF1493",
            fontFamily: 'Inter-Bold',
          }}
        />
      </View>
    </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  web3: state.web3,
  account: state.reducers.account,
  seedPhrase: state.reducers.seedPhrase,
})

const mapDispatchToProps = (dispatch) => {
  // Action
  return {
    STPupdateAccounts: (account0) => dispatch(STPupdateAccounts(account0)),
    STPupdateSeedPhrase: (seedPhrase) => dispatch(STPupdateSeedPhrase(seedPhrase)),
  };
};

export default connect (
  mapStateToProps,
  mapDispatchToProps,
) (WalletSettings)

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#9999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapperStyle :{
    backgroundColor: '#00000000',
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
  },
  button1 :{
    width: '100%',
    backgroundColor: "#ffffff",
    borderRadius: 2,
    borderColor: "#ffffff",
    borderWidth: 1,
    shadowColor: "rgba(0,0,0,.12)",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    justifyContent: 'space-between'
  },
  bigTextView: {
    fontFamily: "Cochin",
    fontSize: 15,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    marginTop: '2%',
    paddingTop: '5%',
    paddingHorizontal: '4%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: theme.COLORS.WHITE,
  },
  rows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickra: {
    fontSize: 27,
    fontWeight: '600',
    lineHeight: 33,
    color: theme.APP_COLOR,
    fontFamily: 'Inter-Bold',
  },
  ocean: {
    color: '#8C98A9',
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    fontWeight: '600',
  },
  txtPortfolio: {
    color: theme.COLORS.BLACK,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  txtOceanDelta: {
    color: '#84c380',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  containers: {
    flex: 2,
    backgroundColor: '#9999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapperStyle :{
    backgroundColor: '#00000000',
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
  },
  button1 :{
    width: '100%',
    backgroundColor: "#ffffff",
    borderRadius: 2,
    borderColor: "#ffffff",
    borderWidth: 1,
    shadowColor: "rgba(0,0,0,.12)",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    justifyContent: 'space-between'
  },
})
