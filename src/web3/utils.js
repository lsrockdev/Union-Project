import { randomBytes } from 'react-native-randombytes';
import {rinkebyConnect} from '../web3/getWeb3'
import {ropstenConnect} from '../web3/getWeb3'
import {kovanConnect} from '../web3/getWeb3'
import {mainConnect} from '../web3/getWeb3'

export const getRandom = (count) => new Promise((resolve, reject) => {
  return randomBytes(count, (err, bytes) => {
    if (err) reject(err)
    else resolve(bytes)
  })
})

const getAccFunc = async(web3, STPupdateAccounts) => {
  try {
    let myAccounts
    let accountsRet = await web3.eth.getAccounts()
    if (accountsRet.length == 0) {
      console.log('empty account')
     // myAccounts = '0x0'
    }
    else {
      myAccounts = accountsRet[0]
    }
    console.log(myAccounts)
    STPupdateAccounts(myAccounts)
  } catch (err) {
    console.warn(err)
  }
}

export const createAccFunc = async(web3, STPupdateAccounts) => {
  let myAccounts
  try {
    const entropy = await getRandom(16)
    console.log(entropy)
    if (web3.eth.accounts) {
      myAccounts = web3.eth.accounts.create(entropy);
      console.log("myAccounts:", myAccounts)
      STPupdateAccounts(myAccounts.address)
    }
  } catch (err) {
    console.warn(err)
  }
  return myAccounts;
}

export function checkAccount(web3, STPupdateAccounts) {
  try {
    getAccFunc(web3, STPupdateAccounts)

  } catch (err) {
    //console.warn('web3 provider not open');
    console.warn(err)
    return err;
  }
}

export function createAccount(web3, STPupdateAccounts) {
  try {
    createAccFunc(web3, STPupdateAccounts)

  } catch (err) {
    //console.warn('web3 provider not open');
    console.warn(err)
    return err;
  }
}

export function updateSeedPhrase(seed, STPupdateSeedPhrase) {
  try {
    console.log(seed)
    STPupdateSeedPhrase(seed)

  } catch (err) {
    //console.warn('web3 provider not open');
    console.warn(err)
    return err;
  }
}

export function updateAccts(myAccounts, STPupdateAccounts) {
  try {
    console.log(myAccounts)
    STPupdateAccounts(myAccounts)

  } catch (err) {
    //console.warn('web3 provider not open');
    console.warn(err)
    return err;
  }
}

export async function checkNetwork(web3) {
  try {
    return web3.eth
      .getBlock(0)
      .then(block => {
        console.log("web3 block:", block)
        switch (block.hash) {
          case '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3':
            return 'mainnet';
          case '0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177':
            return 'rinkeby';
          case '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d':
            return 'ropsten';
          case '0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9':
            return 'kovan';
          default:
            return 'local';
        }
      })

  } catch (err) {
    console.warn('web3 provider not open');
    return "none";
  }
}

export const balHandler = async({address, networktype}) => {
  let rinkebyEtherBal = await rinkebyConnect().eth.getBalance(address).then(bal => rinkebyConnect().utils.fromWei(bal, 'ether'))
  let ropstenEtherBal = await ropstenConnect().eth.getBalance(address).then(bal => ropstenConnect().utils.fromWei(bal, 'ether'))
  let kovanEtherBal = await kovanConnect().eth.getBalance(address).then(bal => kovanConnect().utils.fromWei(bal, 'ether'))
  let mainEtherBal = await mainConnect().eth.getBalance(address).then(bal => mainConnect().utils.fromWei(bal, 'ether'))
  
  try {
    
    return (networktype == "rinkeby") ? (rinkebyEtherBal)
    : (networktype == "kovan") ? (kovanEtherBal)
    : (networktype == "ropsten") ? (ropstenEtherBal)
    : (mainEtherBal);
    
  }
  catch(err){console.log(err)}

  };