import React, {useState, useEffect} from 'react'
import {StyleSheet, View, Text, TextInput, ScrollView, SafeAreaView} from 'react-native'
import {connect} from "react-redux"
import Button from '../components/Button';
import {theme} from '../services/Common/theme';
//import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import {getWeb3} from '../web3/getWeb3'
import {rinkebyConnect} from '../web3/getWeb3'
import {ropstenConnect} from '../web3/getWeb3'
import {kovanConnect} from '../web3/getWeb3'
import {mainConnect} from '../web3/getWeb3'
import {web3} from '../web3/getWeb3'
import Web3 from 'web3'
//import Navbar from './Navbar'
//import Main from './Main'
import minABI from '../abis/minABI.json'
import oceanContract from '../abis/oceanContract0x967d.json'

function WalletActions(props) {
  const [destination, setDestination] = useState("")
  //const [password, setPassword] = useState("")
  const [amount, setAmount] = useState(0)
  //const [web3, setWeb3] = useState(undefined);
  const [tokenBal, setTokenBal] = useState("");
  const [newAccount, setNewAccount] = useState("");
  const [newPKey, setNewPKey] = useState("");
  const [TxHash, setTxHash] = useState('')
  const [TxError, setTxError] = useState('')
  const [stakingBal, setStakingBal] = useState('0')
  const [rewardBal, setRewardBal] = useState('0')



  const walletParams = props.route.params;
  console.log("Wallet Params:", walletParams)


  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function awaitTransaction(txHash) {
      let tx = null;
      while (tx == null) {
          tx = await (web3(walletParams.networktype)).eth.getTransactionReceipt(txHash);
          await sleep(2000);
      }
      console.log("Transaction " + txHash + " was mined.");
      return (tx.status);
  }
  
  const transferToken = async() => {
    /**
     * Procedure for ERC20 Token Transfer
     * 1. First read the state of a smart contract (for eg the balance of an ERC20 holder)
     * 2. Then we’ll modify the state of the blockchain by making a token transfer
     */
    
    //To interact with a smart contract we’ll need its address and ABI:
    //We will also need two more address( sender and receiver); making a total of 3 Address
    //DAI Token Smart Contract ABI
    const ERC20TransferABI = [
      {
          "constant": false,
          "inputs": [
              {
                  "name": "_to",
                  "type": "address"
              },
              {
                  "name": "_value",
                  "type": "uint256"
              }
          ],
          "name": "transfer",
          "outputs": [
              {
                  "name": "",
                  "type": "bool"
              }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "constant": true,
          "inputs": [
              {
                  "name": "_owner",
                  "type": "address"
              }
          ],
          "name": "balanceOf",
          "outputs": [
              {
                  "name": "balance",
                  "type": "uint256"
              }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
      },
  ]
  
    // DAI Token address
    const DAIADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f" //Mainnet token address
    let phecor0RinkebyContract = "0xe793a47892854260b42449291953dadbddb4226d"//rinkeby token address
    let DaiKovanContract = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa";
    let mDaiRinkebyContract = "0x6f5390A8CD02d83B23C5f1d594bFFB9050Eb4Ca3";
    //Instantiate the smart contract
    let myWallet1 = '0x5D363EC1EF55005C39c0e36C50b06242aeb3C3D4'
    let myWallet2 = '0x5A877a6B662B6b2D19B3366cD766E67C300e91fF'
    let myWallet1PKey = "84d8bd3e50eddf675f37227e40df9c395f48367548ea3f9ca4d2ff33a473fe16"

    let fromAddress = myWallet1
    let toAddress = myWallet2

    const phecorTokenInstance = new (web3(walletParams.networktype)).eth.Contract(ERC20TransferABI, phecor0RinkebyContract);
    var contract = new (web3(walletParams.networktype)).eth.Contract(ERC20TransferABI, phecor0RinkebyContract, {from: fromAddress});
    const senderAddress = "0x4d10ae710Bd8D1C31bd7465c8CBC3add6F279E81"
    const receiverAddress = "0x19dE91Af973F404EDF5B4c093983a7c6E3EC8ccE"
    
    //call  balanceOf() to get the balances in both accts. (sender n receiver)
    //note that this method accepts both token and wallet addresses and outputs the balance
    // of the token wrt the network(rinkeby, mainnet, etc)
    phecorTokenInstance.methods.balanceOf(myWallet1).call(function(err,wallet1Bal ) {
      phecorTokenInstance.methods.balanceOf(myWallet2).call(function(err, wallet2Bal) {
        phecorTokenInstance.methods.balanceOf(phecor0RinkebyContract).call(function(err, phecorBal) {
      if (err) {
          console.log("An error occured", err);
          return
      }
      console.log({wallet1Bal: wallet1Bal, wallet2Bal: wallet2Bal, phecorBal: phecorBal})
    })
  })
})

//transfer 1 phecor token from wallet1 to wallet2 
const TOKEN_ADDED = (web3(walletParams.networktype)).utils.toHex(0.5*10**18) // 0.5  tokens
const nonce = await (web3(walletParams.networktype)).eth.getTransactionCount(fromAddress, 'latest');
const amount = 10000000000000000000;

const transaction = {
  'to': phecor0RinkebyContract, //  address to receive phecor tokens (contract address NOT recipient)
  'value': TOKEN_ADDED , // 1 ETH = 1000000000000000000 wei
  'gasLimit': (web3(walletParams.networktype)).utils.toHex(10000000),
  'gasPrice': (web3(walletParams.networktype)).utils.toHex(10000000000),
  //"handle Revert": true,
   //'gas': 10000000,
  'nonce': (web3(walletParams.networktype)).utils.toHex(nonce),
  'data': contract.methods.transfer(phecor0RinkebyContract, TOKEN_ADDED).encodeABI(), 
  //'chain':'rinkeby'
 
};
 

 const signedTx = await  (web3(walletParams.networktype)).eth.accounts.signTransaction(transaction, myWallet1PKey);

 (web3(walletParams.networktype)).eth.estimateGas({
  "from"      : fromAddress,       
  "nonce"     :  (web3(walletParams.networktype)).utils.toHex(nonce), 
  "to"        : phecor0RinkebyContract,   // Note: this should be the contract address  except you're sending ether
  //"data"      : encodedABI,
  'value'     : TOKEN_ADDED 
})
.then(function(receipt){
  console.log("Gas Estimate:", receipt) // contains the new contract address
})
.catch(function(error){
    console.log(error)
});


(web3(walletParams.networktype)).eth.getGasPrice()
.then(function(price){console.log("GasPrice:", price)});

await (web3(walletParams.networktype)).eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
  if (!error) {
    console.log("🎉 The hash of your transaction is: ", hash, "\n Visit etherscan to view the status of your transaction!");
    console.log("SignedTx: \m",signedTx )
  } else {
    console.log("❗Something went wrong while submitting your transaction:", error)
  }
})



} 

  const stakeToken = async() => {
    let quicra0LiqPoolContract = "0xAAB9EaBa1AA2653c1Dda9846334700b9F5e14E44"
    let quicra0TokenContract = "0x7Bce67697eD2858d0683c631DdE7Af823b7eea38"
    let phecor0RinkebyTokenContract = "0xe793a47892854260b42449291953dadbddb4226d"
    let oceanRinkebyContract = "0x8967BCF84170c91B0d24D4302C2376283b0B3a07"; //rinkeby ocean
    let walletAddress = "0x5D363EC1EF55005C39c0e36C50b06242aeb3C3D4"; // wallet

    const web3_ = new Web3(Web3.givenProvider || "https://rinkeby.infura.io/v3/48f3dfa7944f442980a90c625e2f2921");
    let fromAddress = walletAddress;
    const tokenAddress = oceanRinkebyContract; //liquidity contract 
    const toAddress = "0x5A877a6B662B6b2D19B3366cD766E67C300e91fF"; // recipient address; wallet2
    const privKey = "84d8bd3e50eddf675f37227e40df9c395f48367548ea3f9ca4d2ff33a473fe16"
    let decimals = (web3(walletParams.networktype)).utils.toBN(18);
    let amount = (web3(walletParams.networktype)).utils.toBN(100);
    //const ETH_ADDED = (web3(walletParams.networktype)).utils.toWei('0.1', 'ether') // 0.1 ETH
    const TOKEN_ADDED = (web3(walletParams.networktype)).utils.toHex(15*10**18) // 15  tokens
   // const tokensAdded1 = web3_.utils.toHex(5*10**18)
    //const check = web3_.utils.randomHex(32)
    // Get ERC20 Token contract instance

    //2.function transfer(address to, uint256 value) external returns (bool);
    // move amount of tokens(uint256 value) from the owner’s balance (owners' wallet address)
    // to that of another user (address to or recipient)


    //1.function approve(address spender, uint256 value) external returns (bool);// use in marketplaces
    //allow an owner i.e. msg.sender to approve a delegate account (address spender) —
    // possibly the marketplace itself — to withdraw tokens from his account
    // and to transfer them to other accounts

    let contract_ = new (web3(walletParams.networktype)).eth.Contract(minABI, tokenAddress);
    let contract = new (web3(walletParams.networktype)).eth.Contract(oceanContract, tokenAddress);// calculate ERC20 token amount
    //let value = amount.mul(web3(walletParams.networktype)).utils.toBN(10).pow(decimals);
    
    //const tx = LiquidityContract.methods.addLiquidity(1, value , DEADLINE);
    //const tx = LiquidityContract.methods.approve(quicra0LiqPoolContract, TOKEN_ADDED);
   // const tx = contract.methods.approve(tokenAddress, TOKEN_ADDED).send({ from: fromAddress }).on('transactionHash', (hash) => {
   //   walletParams.tokenFarm.methods.stakeTokens(TOKEN_ADDED).send({ from: fromAddress }).on('transactionHash', (hash) => {
   //     this.setState({ loading: false })
   //   })
   // })

  const tx = contract.methods.balanceOf(tokenAddress).call((error, balance) => {
    contract.methods.approve(tokenAddress, TOKEN_ADDED).call((error, approval) => {
    contract.methods.transfer(tokenAddress, TOKEN_ADDED).call((error, transferred) => {
    
      console.log({approval:`: transfer to ${tokenAddress}:`+ approval,
       formattedBal: (web3(walletParams.networktype)).utils.fromWei(balance),transferred: transferred});

        //console.log("ERC20 token approved to " + receiver);
      });
    });
  })

  
  //.encodeABI()

 // .then(function(result){console.log("result:", result)})


  //  contract.methods.transfer(toAddress, TOKEN_ADDED).send({from: fromAddress})
  //  .on('transactionHash', function(hash){
  //    console.log("Success! hash:", hash);
  //  })
  //  .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
  //    console.log({error: receipt, error: error})
  //  });


 // const encodedABI = tx.encodeABI();
 //console.log("endcoded:", encodedABI) 

  /***
    const nonce = await (web3(walletParams.networktype)).eth.getTransactionCount(fromAddress, 'latest');
    const transaction = {
      'to': addressTo, // faucet address to return eth
      //'value': TxValue , // 1 ETH = 1000000000000000000 wei
      'gasLimit': (web3(walletParams.networktype)).utils.toHex(10000000),
      'gasPrice': (web3(walletParams.networktype)).utils.toHex(10000000000),
      //"handle Revert": true,
      //'gas': 10000000,
      'nonce': (web3(walletParams.networktype)).utils.toHex(nonce),
      'data': encodedABI, // optional data field to send message or execute smart contract
      'value': ETH_ADDED 
    };
    
 */
 //const signedTx = await  (web3(walletParams.networktype)).eth.accounts.signTransaction(transaction, privKey);
    // call transfer function

   // console.log({decimals: decimals, tokensAdded1: tokensAdded1, amount: amount, TOKEN_ADDED: TOKEN_ADDED})
    //console.log({value: value, tokensAdded: TOKEN_ADDED, TOKEN_ADDED: ETH_ADDED, ETH_ADDED: ETH_ADDED, contract: contract})
    /**
     * myContract.methods.myMethod(123).call({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'}, function(error, result){
    ...
    });
     * 

   */

/** 
    walletParams.daiToken.methods.approve(walletParams.tokenFarm._address, amount).send({ from: walletParams.account }).on('transactionHash', (hash) => {
      walletParams.tokenFarm.methods.stakeTokens(amount).send({ from: walletParams.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
    */
  }

  const sendSignedTx = async() => {

    console.log("newAccount:", newAccount)
   // setNewAccount(newAccount)
    //setNewPKey(walletParams.privateKey);

    const TxValue = (web3(walletParams.networktype)).utils.toWei(amount, 'ether');
    const nonce = await  (web3(walletParams.networktype)).eth.getTransactionCount(newAccount, 'latest');
    const transaction = {
      'to': destination, // faucet address to return eth
      'value': TxValue , // 1 ETH = 1000000000000000000 wei
      'gas': 1000000, 
      'nonce': nonce,
      // optional data field to send message or execute smart contract
     };
     //const signedTx = await  (web3(walletParams.networktype)).eth.accounts.signTransaction(transaction, newPKey);
     //console.log({signedTx: signedTx, transaction: transaction, newAccount: newAccount, destination: destination, PKey: newPKey})
    const Key = walletParams.privateKey
    

     const signedTx = await  (web3(walletParams.networktype)).eth.accounts.signTransaction(transaction, Key);
     console.log({ newAccount: newAccount, transaction: transaction, newPKey: Key })
     await (web3(walletParams.networktype)).eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
        //this.hash = hash
      if (!error) {
        setTxHash(hash)
        console.log("🎉 The hash of your transaction is: ", hash, "\n Check etherscan dashboard for the status of your transaction!");
        console.log("SignedTx: \m",signedTx )
      } else {
        setTxError("Error Sending Tx:"+ error)
        console.log("❗Something went wrong while submitting your transaction:", error)
      }
    });
      
  }

  const ethBalance = async(address) => {
    let ethBal = await (web3(walletParams.networktype)).eth.getBalance(address).then(bal => (web3(walletParams.networktype)).utils.fromWei(bal, 'ether'))
    setTokenBal(ethBal);
    setNewAccount(address);
    };

  const handleSendSignedTx = async(amount) => {

    const nonce = await  (web3(walletParams.networktype)).eth.getTransactionCount(newAccount, 'latest'); // nonce starts counting from 0
    
    const transaction = {
    'to': destination, // faucet address to return eth
    'value':  (web3(walletParams.networktype)).utils.toWei("0.1", 'ether'), // 1 ETH = 1000000000000000000 wei
    'gas': 1000000, 
    'nonce': nonce,
    // optional data field to send message or execute smart contract
   };
  
   const signedTx = await  (web3(walletParams.networktype)).eth.accounts.signTransaction(transaction, newPKey);
   console.log({signedTx: signedTx, nonce: nonce, tokenBal: tokenBal, destination: destination, PKey: newPKey})

   (web3(walletParams.networktype)).eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
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
              onChangeText={(address) => ethBalance(address)}
            />
              {/**
                 <Text style={styles.bigTextView} >Private Key</Text>
                  <TextInput 
                    selectable={true}
                    selectTextOnFocus={true}
                    placeholder="private key"
                    value={newPKey}
                    onChangeText={(key) => (setNewPKey(key))}
                  />
              */}

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
            {TxHash?
            (<View>
               <Text style={{color: "green"}}>Success!</Text><Text > TxHash: {TxHash}</Text>
            </View>):<Text></Text> }
            {TxError?
            (<View>
               <Text style={{color: "red"}}>Error!</Text><Text >{TxError}</Text>
            </View>):<Text></Text> }
          <Button
            color="#f2f2f2"
            title="Send"
            buttonStyle={{
            borderRadius: 25,
            width: '70%',
            alignSelf: 'center',
              }}
            onPress={() => sendSignedTx()}
            textStyle={{
              fontSize: 19,
              fontWeight: '600',
              color: theme.APP_COLOR,
              fontFamily: 'Inter-Bold',
            }}
           />  
           <Text></Text>
            <View style={{alignItems: 'flex-end'}}>
            </View>  
            <View style={styles.rows}>
            <View>
              
              <Text style={styles.ocean}> {walletParams.oceanerc20Bal} OCEAN </Text>
              <Text style={styles.ocean}> {walletParams.pheco0erc20balance} PHECOR-0 </Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.txtPortfolio}> STAKING BALANCE: {stakingBal}</Text>
            
            </View>
          </View>
            <TextInput
              placeholder="enter OCEAN amount to stake"
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
            onPress={() => transferToken()}
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
