import Web3 from 'web3'
import { store } from '../store/store'
import { ganachehost, rinkeby } from './constants'
import { web3Initialized } from '../actions/actions.js'
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

/*
export const WEB3_INITIALIZED = 'WEB3_INITIALIZED'

export const web3Initialized = (results) => {
  return {
    type: actionTypes.WEB3_INITIALIZED,
    payload: results,
  }
};*/

export const getWeb3_ = new Promise((resolve, reject) => {
  let results
  let web3 = {}

 // mnemonic = "pride auto solar tomorrow trim dismiss myth alert scrap gap clean rotate"

  // Wait for loading completion to avoid race conditions with web3 injection timing.
 web3 = new Web3(new Web3.providers.HttpProvider(rinkeby))
  results = {
    web3Instance: web3,
  }
  resolve(store.dispatch(web3Initialized(results)))
})

export const getWeb3 = () => {
  const res = createAlchemyWeb3("https://eth-rinkeby.alchemyapi.io/v2/J1LeelYCWPBCv5auJWmbH4gNTWuYP1OI");
  //console.log({Web3res: res})
  return res
}
