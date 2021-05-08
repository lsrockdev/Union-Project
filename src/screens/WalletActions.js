import React, {useState, useEffect} from 'react'
import {StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView} from 'react-native'
import {connect} from "react-redux"
import Button from '../components/Button';
import {theme} from '../services/Common/theme';
//import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import {getWeb3} from '../web3/getWeb3'


function WalletActions(props) {
  const [destination, setDestination] = useState("")
  //const [password, setPassword] = useState("")
  const [amount, setAmount] = useState(0)
  const [web3, setWeb3] = useState(undefined);
  const [tokenBal, setTokenBal] = useState("0x0");
  const [newAccount, setNewAccount] = useState("");
  const [newPKey, setNewPKey] = useState("");
  const [networkId, setNetworkId] = useState(null);
  const [blocknum, setBlocknum] = useState(null);

  const walletParams = props.route.params;
  console.log("Wallet Params:", walletParams)
 
  useEffect(() => {
    const init = async() => {
      const web3 = getWeb3()
      const newAccount = walletParams.address 
      const newPKey = walletParams.privateKey
      const tokenBal = await web3.eth.getBalance(newAccount).then(bal => web3.utils.fromWei(bal, 'ether'))
    
      setWeb3(web3)
      setNewAccount(newAccount)
      setNewPKey(newPKey)
      setDestination(destination)
      setTokenBal(tokenBal );
    }
    init();
  }, [])

  const handleSendSignedTx = async(amount) => {

    const nonce = await web3.eth.getTransactionCount(newAccount, 'latest'); // nonce starts counting from 0
    
    const transaction = {
    'to': destination, // faucet address to return eth
    'value': web3.utils.toWei("0.5", 'ether'), // 1 ETH = 1000000000000000000 wei
    'gas': 1000000, 
    'nonce': nonce,
    // optional data field to send message or execute smart contract
   };
  
   const signedTx = await web3.eth.accounts.signTransaction(transaction, newPKey);
   console.log({signedTx: signedTx, nonce: nonce, tokenBal: tokenBal, destination: destination, PKey: newPKey})

    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
      //this.hash = hash
    if (!error) {
      console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
      console.log("SignedTx: \m",signedTx )
    } else {
      console.log("❗Something went wrong while submitting your transaction:", error)
    }
   });
 }

  return(
    <ScrollView  showsVerticalScrollIndicator={true}  >
      <View style={styles.container}>
        <View>
          <Text style={styles.bigTextView} >My Address</Text>
            <TextInput 
              selectable={true}
              selectTextOnFocus={true}
              placeholder="public address"
              value={newAccount}
            />
          <Text style={styles.bigTextView} >Send to</Text>
            <TextInput 
              selectable={true}
              selectTextOnFocus={true}
              placeholder="destination address"
              value={destination}
              onChangeText={(address) => (setDestination(address))}
            />
          <Text style={styles.bigTextView} >Amount (ETH)</Text>
           <Text> {tokenBal} ETH Available</Text> 
            <TextInput
              selectable={true}
              selectTextOnFocus={true}
              placeholder="amount to send"
              onChangeText={(amount) => (setAmount(amount))}
            />
            <Text></Text>
          <Button
            color="#f2f2f2"
            title="Send"
            buttonStyle={{
            borderRadius: 25,
            width: '70%',
            alignSelf: 'center',
              }}
            onPress={(amount) => handleSendSignedTx(amount)}
            textStyle={{
              fontSize: 19,
              fontWeight: '600',
              color: theme.APP_COLOR,
              fontFamily: 'Inter-Bold',
            }}
           />  
            <Text style={styles.bigTextView} >Amount</Text>
           <Text>0.22 Quickra-0 Staked</Text> 
            <TextInput
              placeholder="amount to stake"
              onChangeText={(amount) => (setAmount(amount))}
            />
          <Button
            color="#f2f2f2"
            title="Stake"
            buttonStyle={{
            borderRadius: 25,
            width: '70%',
            alignSelf: 'center',
              }}
            onPress={() => alert('Stake')}
            textStyle={{
              fontSize: 19,
              fontWeight: '600',
              color: theme.APP_COLOR,
              fontFamily: 'Inter-Bold',
            }}
           /> 
          <Button
              color="#f2f2f2"
              title="UnStake"
              buttonStyle={{
              borderRadius: 25,
              width: '70%',
              alignSelf: 'center',
                }}
              onPress={() => alert('Unstake')}
              textStyle={{
                fontSize: 19,
                fontWeight: '600',
                color: theme.APP_COLOR,
                fontFamily: 'Inter-Bold',
            }}
           />
        </View>
        <Text></Text>
    </View>
    </ScrollView >
  )
}

const styles = StyleSheet.create({
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
  buttons :{
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

const mapStateToProps = state => ({
  web3: state.web3,
  account: state.reducers.account,
  seedPhrase: state.reducers.seedPhrase,
  password: state.reducers.password,
})

export default connect (
  mapStateToProps,
  null,
) (WalletActions)
