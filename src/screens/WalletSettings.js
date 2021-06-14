//import '../../shim.js'
import React, {Component} from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity,TouchableHighlight, ToastAndroid} from 'react-native'
import Clipboard from '@react-native-community/clipboard';
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
//import { Ocean, ConfigHelper } from '@oceanprotocol/lib'
import {rinkebyConnect} from '../web3/getWeb3'
import {ropstenConnect} from '../web3/getWeb3'
import {kovanConnect} from '../web3/getWeb3'
import {mainConnect} from '../web3/getWeb3'
import {rinkeby} from '../web3/constants'
import {ropsten} from '../web3/constants'
import {kovan} from '../web3/constants'
import {mainnet} from '../web3/constants'
import {web3} from '../web3/getWeb3'
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import {Picker} from '@react-native-picker/picker';
import { ethers } from "ethers";
import Web3 from 'web3'
import CopyTextBox from '../components/CopyTextBox';
import Ripple from '../components/Ripple';
import CButton from '../components/CButton';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import minABI from '../abis/minABI.json'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import erc20 from '../abis/erc20.json'
import exchange from '../abis/exchange.json'
import factory from '../abis/factory.json'
import address from '../abis/address.json'
//import { Ocean, Config, ConfigHelper, Logger } from '@oceanprotocol/lib'

 


class WalletSettings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isConnected: false,
      publicKey: '',
      privateKey: '',
      pword: '',
      mnemonics:'',
      newdialogVisible: false,
      restoredialogVisible: false,
      selectedLanguage: '',
      networktype: 'none',
      wallet: " ",
      ethTokenBal: " ",
      oceanERC20TokenBal: " ",
      phec0ERC20TokenBal: " ",
      account: '0x0',
      daiToken: '',
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      age: ''

    };

   // const [age, setAge] = useState('')


    this.web3 = null
    this.rinkebynet = 'none'
    this.ropstennet = 'none'
    this.kovannet = 'none'
    this.mainnet = 'none'
    this.rinkebyCheck = 'none'
    this.ropstenCheck = 'none'
    this.kovannetCheck = 'none'
    this.mainnetCheck = 'none'
    //this.wallet = ""
       

   const checkNetwork = setInterval(async() => {
        try {
          this.setState({networktype: await rinkebyConnect().eth.net.getNetworkType()})
          this.setState({networktype: await kovanConnect().eth.net.getNetworkType()})
          this.setState({networktype: await ropstenConnect().eth.net.getNetworkType()})
          this.setState({networktype: await mainConnect().eth.net.getNetworkType()})
         // this.rinkebynet =  await rinkebyConnect().eth.net.getNetworkType()
        //  this.kovannet = await kovanConnect().eth.net.getNetworkType()
        //  this.ropstennet = await ropstenConnect().eth.net.getNetworkType()
        //  this.mainnnet = await mainConnect().eth.net.getNetworkType()
          this.rinkebyCheck = await rinkebyConnect().eth.net.isListening()
          this.ropstenCheck =  await ropstenConnect().eth.net.isListening()
          this.kovannetCheck = await kovanConnect().eth.net.isListening()
          this.mainnetCheck = await mainConnect().eth.net.isListening()

        } catch (error) {
          console.error('error:', error);
        }

     if (this.rinkebyCheck == true || this.ropstenCheck == true || this.kovannetCheck == true || this.mainnetCheck == true ) {
      this.setState({ isConnected: true, })
      //console.log("CONNECTED!")
     }
     //rinkebynet = await rinkebyConnect().eth.net.getNetworkType()
     //this.setState({ rinkebynet: await rinkebyConnect().eth.net.getNetworkType()})
     clearInterval(checkNetwork);

    },1000)

    const web3Returned = setInterval(async() => {
      if (this.props.web3 != null) {
        clearInterval(web3Returned);
        this.web3 = this.props.web3.web3Instance
       // console.log("web3 result:", this.web3)
        Utils.checkNetwork(this.web3).then((res) => {
          console.log("Network:", res)
         // this.networktype = res
            this.setState({ networktype : res });
          if ((res == 'local') || (res == 'rinkeby') || (res == 'kovan') || (res == 'ropsten') || (res == 'main')) {
            this.setState({ isConnected: true, })
          }
        })
        try {
          console.log('check account')
          Utils.checkAccount(this.web3, this.props.STPupdateAccounts);
        } catch (err) {
          console.error('error', err);
        }
      }
    },1000)
  }

  componentDidMount() {
    this.readStoredWallet()
  }

  STORAGE_KEY = '@save_Keys'
  STORAGE_KEY2 = '@save_Pwd'
  STORAGE_KEY3 = '@save_Phrase'

  createNewAccts = async() => {
      let allWallets = []
      const entropy = await Utils.getRandom(16);
      try {
        
        allWallets = await (web3(this.state.networktype)).eth.accounts.wallet.create(1, entropy) 
       //console.log({allWallets: allWallets[0]})
      } catch (error) {
        console.log(error)
      }
      return allWallets[0].address?allWallets[0].address
             :allWallets[0].privateKey?allWallets[0].privateKey
             :""
    }


  handleNewWallet = async() => {
      let allWallets = []
      let allEthBal = " "
      let oceanrinkeby, oceanropsten, oceanmainnet = ""
      let daiToken, daiTokenBalance = " "
      let phec0rinkeby = ""
      const entropy = await Utils.getRandom(16);
      //console.log({DaiToken: DaiToken, DappToken: DappToken, minABI: minABI, TokenFarm: TokenFarm})
      let oceanRinkebyContract = "0x8967BCF84170c91B0d24D4302C2376283b0B3a07"; //rinkeby ocean
      let walletAddress = "0x5D363EC1EF55005C39c0e36C50b06242aeb3C3D4"; // wallet
      let oceanRopstenContract = "0x5e8DCB2AfA23844bcc311B00Ad1A0C30025aADE9"; // ropsten ocean
      let oceanMainnetContract = "0x967da4048cD07aB37855c090aAF366e4ce1b9F48"; // ocean mainnet
      let polygonMainnetContract = "0x282d8efCe846A88B159800bd4130ad77443Fa1A1"// Polygon Mainnet (previously Matic)
      let DaiMainnetContract = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
      let DaiKovanContract = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa";
      let mDaiRinkebyContract = "0x6f5390A8CD02d83B23C5f1d594bFFB9050Eb4Ca3";
      let erc20RinkebyContract = "0xCC4d8eCFa6a5c1a84853EC5c0c08Cc54Cb177a6A";
      let erc20LiqExchContract = "0x416F1Ac032D1eEE743b18296aB958743B1E61E81"
      let erc20WalletAddress = "0x0E364EB0Ad6EB5a4fC30FC3D2C2aE8EBe75F245c"
      let uniswapExchangeContract = "0xf5d915570bc477f9b8d6c0e980aa81757a3aac36"
      let quicra0LiqPoolContract = "0xAAB9EaBa1AA2653c1Dda9846334700b9F5e14E44"
      let quicra0TokenContract = "0x7Bce67697eD2858d0683c631DdE7Af823b7eea38"
      let phecor0RinkebyTokenContract = "0xe793a47892854260b42449291953dadbddb4226d"


      try {
        
        allWallets = await (web3(this.state.networktype)).eth.accounts.wallet.create(1, entropy) 
        allEthBal = await (web3(this.state.networktype)).eth.getBalance(allWallets[0].address).then(bal => 
          (web3(this.state.networktype)).utils.fromWei(bal, 'ether'))
        this.state.isConnected?this.setState({ ethTokenBal: allEthBal }):this.setState({ethTokenBal: " "})
        this.state.isConnected?this.setState({ wallet: allWallets }):this.setState({wallet: "" })
        this.state.isConnected?this.setState({publicKey: allWallets[0].address}): this.setState({publicKey: ''})
        this.state.isConnected?this.setState({privateKey: allWallets[0].privateKey}):this.setState({privateKey: " "})
        
        // saving..


       console.log({allWallets: allWallets[0], allEthBal: allEthBal})
       console.log({ethTokenBal: this.state.ethTokenBal, wallet: this.state.wallet,
         publicKey:this.state.publicKey, privateKey: this.state.privateKey})

      } catch (error) {
        console.log(error)
      }
      //DaiToken...
      const networkId = await (web3(this.state.networktype)).eth.net.getId()
      const daiTokenData = DaiToken.networks[5777]

//ERC Balances...
 if ((this.state.isConnected && this.state.networktype == "rinkeby")) {
    oceanrinkeby = new (web3(this.state.networktype)).eth.Contract(minABI, oceanRinkebyContract);
    phec0rinkeby = new (web3(this.state.networktype)).eth.Contract(erc20, phecor0RinkebyTokenContract);
  

 //console.log('destination:', address.rinkeby.DTFactory)
 
     phec0rinkeby.methods.balanceOf(walletAddress).call((error, balance) => {
       let formatted = (new Web3(rinkeby)).utils.fromWei(balance )
       console.log('formatted:', formatted)
       let rounded = (Math.round((formatted) * 100)) / 100
       this.setState({phec0ERC20TokenBal: rounded})
        console.log({pheco0erc20balance: balance, formattedBalance: this.state.phec0ERC20TokenBal})
  });
        //console.log({oceanrinkeby: oceanrinkeby, erc20Token: erc20Token, ExchContract: ExchContract});
      //  console.log({ tx: tx, encodeABI: encodedABI})
        
    oceanrinkeby.methods.balanceOf(walletAddress).call((error, balance) => {
        this.setState({oceanERC20TokenBal: (new Web3(rinkeby)).utils.fromWei(balance)})
        console.log({oceanbalance: balance, formattedBalance: this.state.oceanERC20TokenBal});
    });
    
 }
 
 else if ((this.state.isConnected && this.state.networktype == "ropsten")) {
  oceanropsten = new (web3(this.state.networktype)).eth.Contract(minABI, oceanRopstenContract);
  oceanropsten.methods.balanceOf(walletAddress).call((error, balance) => {
      this.setState({oceanERC20TokenBal: (new Web3(ropsten)).utils.fromWei(balance)})
      console.log({oceanbalance: balance, formattedBalance: this.state.oceanERC20TokenBal});
     
  });
 } else if ((this.state.isConnected && this.state.networktype == "kovan")) {
      
  console.log("Kovan selected")
 } else {
  oceanmainnet = new (web3(this.state.networktype)).eth.Contract(minABI, oceanMainnetContract);
  oceanmainnet.methods.balanceOf(walletAddress).call((error, balance) => {
    this.setState({oceanERC20TokenBal: (new Web3(ropsten)).utils.fromWei(balance)})
    console.log({oceanbalance: balance, formattedBalance: this.state.oceanERC20TokenBal});  
  });
 }

   console.log({networktype:this.state.networktype, Address: this.state.wallet[0].address })
    
    let sKeys = {}
    let storeKeys = {}
    let salt = "salt"
    let seedPhrase = ""
    let ks = {}
    const saveWallet = async (walletdump) => {
      console.log('saving Wallet...')
      await AsyncStorage.setItem(localStorageKey, JSON.stringify(walletdump));
    };
    
    try {
      bip39.generateMnemonic(128).then((phrase) => {
        console.log('phrase:', phrase)
        this.setState({mnemonics: phrase})
        //seedPhrase = phrase
       // Utils.updateSeedPhrase(seedPhrase, this.props.STPupdateSeedPhrase)
      })  

      let arr = new Uint8Array(20);
      crypto.getRandomValues(arr);

      let password = btoa(String.fromCharCode(...arr)).split('').filter(value => {
          return !['+', '/' ,'='].includes(value);
        }).slice(0,10).join('');

      this.setState({pword: password})  
      
       sKeys = {
        password: this.state.pword,
        seedPhrase: this.state.mnemonics,
        publicKey: this.state.publicKey,
        privateKey: this.state.privateKey,
        ethBal: this.state.ethTokenBal,
        oceanBal: this.state.oceanERC20TokenBal,
        phecorBal: this.state.phec0ERC20TokenBal
   }
       this.storeKeys = sKeys;

      this.saveWallet();

     // this.password = password;
      //this.seedPhrase = seedPhrase;
      /**
      const opt = { password, seedPhrase, hdPathString, salt };

    lightwallet.keystore.createVault(opt, (err, data) => {
      if (err)
      console.log("keystore:", data)
        console.warn(err)
      ks = data
      const walletdump = { ver: '1', ks: ks.serialize(), }
      saveWallet(walletdump)
    })
   */
    }

    catch(err){console.log(err)}
    
  }

  handleNewWallet_ = async() => {
    const entropy = await Utils.getRandom(16)
    try {
         while( this.state.isConnected) {
          switch (this.state.networktype) {
            case 'mainnet':
              return mainConnect().eth.accounts.create(entropy).then(res => {this.wallet = res});
            case 'rinkeby':
              return rinkebyConnect().eth.accounts.create(entropy).then(res => {this.wallet = res});
            case 'ropsten':
              return ropstenConnect().eth.accounts.create(entropy).then(res => {this.wallet = res});
            case 'kovan':
              return kovanConnect().eth.accounts.create(entropy).then(res => {this.wallet = res});
            default:
              return 'local';
           }
          }
  
    } catch (err) {
      console.warn('No connection!');
      return "none";
    }
  }
  
  handleNewAccount_ = async() => {
    if(this.state.isConnected && this.state.networktype == "kovan") {
       //let web33 = await rinkebyConnect()
       (Utils.createAccFunc(this.web3, this.props.STPupdateAccounts)).then(res => {
         console.log("res:", res)
        this.wallet = res
        console.log("connected?:", this.state.isConnected)
        console.log("networktype:", this.state.networktype)
       // console.log("rinkebyConnect:", web33)
      });

    }

    let salt = "salt"
    let seedPhrase = ""
    let ks = {}

    const saveWallet = async (walletdump) => {
      console.log('saving Wallet...');
      await AsyncStorage.setItem(localStorageKey, JSON.stringify(walletdump));
    };

    try {
      bip39.generateMnemonic(128).then((mnemonic) => {
        seedPhrase = mnemonic;
        Utils.updateSeedPhrase(seedPhrase, this.props.STPupdateSeedPhrase);
      });

      let arr = new Uint8Array(20);
      crypto.getRandomValues(arr);
      let password = btoa(String.fromCharCode(...arr))
        .split('')
        .filter((value) => {
          return !['+', '/', '='].includes(value);
        })
        .slice(0, 10)
        .join('');

      this.password = password;
      const opt = {password, seedPhrase, hdPathString, salt};

    lightwallet.keystore.createVault(opt, (err, data) => {
      if (err)
        {console.warn(err)}
      ks = data;
        const walletdump = {ver: '1', ks: ks.serialize()};
        saveWallet(walletdump);
    })
    }
    catch(err){console.log(err)}
    console.log({seedphrase: seedPhrase ,ksvault: ks, cryptopass: this.password,  })
   return this.wallet;
  }

  checkERC20Bal = async() => {
    let oceanRinkebyContract = "0x8967BCF84170c91B0d24D4302C2376283b0B3a07"; //rinkeby ocean
    let walletAddress = "0x5D363EC1EF55005C39c0e36C50b06242aeb3C3D4"; // wallet
    let oceanRopstenContract = "0x5e8DCB2AfA23844bcc311B00Ad1A0C30025aADE9"; // ropsten ocean
    let oceanMainnetContract = "0x967da4048cD07aB37855c090aAF366e4ce1b9F48"; // ocean mainnet
    let polygonMainnetContract = "0x282d8efCe846A88B159800bd4130ad77443Fa1A1"// Polygon Mainnet (previously Matic)

};

  saveData = async () => {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, this.state.age)
      alert('Data successfully saved')
    } catch (e) {
      alert('Failed to save the data to the storage')
    }
  }

  readData = async () => {
    try {
      //checkNetwork();
      //initWallet();
      const userAge = await AsyncStorage.getItem(this.STORAGE_KEY)

      if (userAge !== null) {
        //setAge(userAge)
        this.setState({age:userAge})
      }
    } catch (e) {
      alert('Failed to fetch the data from storage')
    }
  } 
  

  saveWallet = async () => {
    
    try {
      console.log('Saving Data...', this.storeKeys)

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.storeKeys))
     // await AsyncStorage.multiSet(multiSet)

      alert('Data successfully saved')

    } catch (e) {
      alert('Failed to save the data to the storage')
    }
  }

  readStoredWallet = async () => {
    try {
      const userInfo = JSON.parse(await AsyncStorage.getItem(this.STORAGE_KEY))
//AsyncStorage.getItem('name').then((value) => this.setState({ 'name': value }))

      console.log({userInfo: userInfo, address:userInfo.publicKey, privateKey:userInfo.privateKey,
      seedphrase:userInfo.seedPhrase, password: userInfo.password, oceanBal: userInfo.oceanBal,
     ethBal:userInfo.ethBal, phecorBal: userInfo.phecorBal})

      if (userInfo !== null) {
        console.log('retrieving saved data...');
        //setAge(userAge)
        this.setState({wallet:userInfo})
        this.setState({publicKey: userInfo.publicKey})
        this.setState({privateKey: userInfo.privateKey})
        this.setState({mnemonics: userInfo.seedphrase})
        this.setState({pword:userInfo.password})
        this.setState({oceanERC20TokenBal: userInfo.oceanBal})
        this.setState({ethTokenBal: userInfo.ethBal})
        this.setState({phec0ERC20TokenBal: userInfo.phecorBal})

        console.log({restoredWallet: this.state.wallet, publicKey: this.state.publicKey, 
          privateKey: this.state.privateKey})
      }
    } catch (e) {
      alert('Failed to fetch the data from storage')
    }
  }

  clearStorage = async () => {
    try {
      await AsyncStorage.clear()
      alert('Storage successfully cleared!')
    } catch (e) {
      alert('Failed to clear the async storage.')
    }
  }


  onChangeText = (userAge) => {
    //setAge(userAge)
    this.setState({age:userAge})
  }

 onSubmitEditing = () => {
  if (!this.state.age) return

    this.saveData(age)
    // setAge('')
      this.setState({age:" "})
}


  render() {
    
    return (
      <ScrollView  showsVerticalScrollIndicator={true}>
        <View>
          <Picker
            selectedValue={this.state.networktype}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({networktype: itemValue })
            }>
            <Picker.Item label="mainnet" value="mainnet" />
            <Picker.Item label="rinkeby" value="rinkeby" />
            <Picker.Item label="kovan" value="kovan" />
            <Picker.Item label="ropsten" value="ropsten" />       
          </Picker>
            <View style={{alignItems: 'center'}}>
          <Text >{this.state.isConnected?`Connected to ${this.state.networktype} node` :`Not Connected`}</Text>
           </View>
        </View>
       <View style={styles.container}>
        <View style={styles.rows}>
        <View>
          <Text></Text>
          <Text style={styles.quickra}>0 QUICRA-0 </Text>
          <Text style={styles.ocean}> {this.state.ethTokenBal} ETH </Text>
          <Text style={styles.ocean}> {this.state.oceanERC20TokenBal} OCEAN </Text>
          <Text style={styles.ocean}> {this.state.phec0ERC20TokenBal} PHECOR-0 </Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={styles.txtPortfolio}> 24h Portfolio</Text>
          <Text style={styles.txtOceanDelta}> (+15.53%) </Text>
        </View>
      </View>
        <View >
        <Text style={styles.bigTextView} >Public Key</Text>
          <View style={styles.parent}>
            <Text numberOfLines={1} style={{ marginTop: '4%', width:100}}> { this.state.publicKey} </Text>
            <CButton text={this.state.publicKey}/>
          </View>
          <Text style={styles.bigTextView} >Mnemonic Phrase</Text>
          <View style={styles.parent}>
            <Text numberOfLines={1} style={{ marginTop: '4%', width:100}}> { this.state.mnemonics} </Text>
            <CButton text={this.state.mnemonics}/>
          </View>
          <Text style={styles.bigTextView} >Private Key</Text>
          <View style={styles.parent}>
            <Text numberOfLines={1} style={{ marginTop: '4%', width:100}}> { this.state.privateKey } </Text>
            <CButton text={this.state.privateKey}/>
          </View>
          <Text style={styles.bigTextView} >Password</Text>
          <View style={styles.parent}>
            <Text numberOfLines={1} style={{ marginTop: '4%', width:100}}> { this.state.pword} </Text>
            <CButton text={this.state.pword}/>
          </View>
        </View>
        <Button
          color="#f2f2f2"
          title="More"
          buttonStyle={{
            borderRadius: 25,
            width: '70%',
            alignSelf: 'center',
          }}
          onPress={() => {
            this.handleNewAccount();
          }}
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
        onPress={this.handleWalletRecovery}
        textStyle={{
          fontSize: 19,
          fontWeight: '600',
          color: "#FF1493",
          fontFamily: 'Inter-Bold',
        }}
      />
      </View>
       <Button
          color="#f2f2f2"
          title="New Wallet"
          buttonStyle={{
            borderRadius: 25,
            width: '70%',
            alignSelf: 'center',
          }}
          onPress={this.handleNewWallet}
          textStyle={{
            fontSize: 19,
            fontWeight: '600',
            color: theme.APP_COLOR,
            fontFamily: 'Inter-Bold',
          }}
        />
        
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
  container_: {
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
   // position:'relative',
    //left:10,
    //top:'-5%'
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
  MainContainer:
  {
    paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    flex: 1,
    padding: 20,
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInputStyle: {
    textAlign: 'center',
    height: 41,
    width: '82%',
    borderWidth: 1,
    borderColor: '#AA00FF',
    borderRadius: 8,
    marginBottom: 20
  },
  button: {
    width: '92%',
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#AA00FF',
    borderRadius: 5,
    marginBottom: 20
  },
  TextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
  Ccontainer: {
    flex: 1,
  },
  parent: {
    //flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.APP_COLOR,
    borderRadius: 8,
    marginBottom: 20
   // justifyContent: 'flex-start'
  }
})
