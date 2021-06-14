import React from 'react';
import Ripple from '../components/Ripple';
import {theme} from '../services/Common/theme';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Text, View, StyleSheet, FlatList} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import bip39 from 'react-native-bip39';
import { hdPathString, localStorageKey } from '../web3/constants';
import * as Utils from '../web3/utils';
import {connect} from 'react-redux';

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.web3 = null;
    this.wallet = '';

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
  componentDidMount() {
    this.handleNewAccount();
  }
  handleNewAccount = () => {
    Utils.createAccFunc(this.web3, this.props.STPupdateAccounts).then((res) => {
      this.wallet = res;
    });
    let salt = 'salt';
    let seedPhrase = '';
    let ks = {};

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
  render() {
    const options = [
      {
        icon: 'info',
        title: 'Info',
        screen: 'About',
        Icon: MaterialIcon,
      },
      {
        title: 'Learn',
        screen: 'Learn',
        icon: 'subscriptions',
        Icon: MaterialIcon,
      },
      {
        title: 'Stats',
        screen: 'Stats',
        icon: 'analytics',
        Icon: MaterialIcon,
      },
      {
        title: 'Wallet',
        screen: 'Wallet',
        icon: 'account-balance-wallet',
        Icon: MaterialIcon,
      },
      {
        title: 'My Stats',
        screen: 'MyStats',
        icon: 'analytics-sharp',
        Icon: IonIcon,
      },
    ];
  
    return (
      <View
        style={{
          flex: 1,
          marginTop: '20%',
          paddingTop: '5%',
          paddingHorizontal: '4%',
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          backgroundColor: theme.COLORS.WHITE,
        }}>
        <Ripple
          outerStyle={{
            marginTop: '-25%',
            borderRadius: 25,
            elevation: 5,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            shadowOffset: {width: 0, height: 4},
            backgroundColor: '#F5F6FC',
            marginVertical: 10,
            marginHorizontal: '5%',
          }}
          innerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            paddingVertical: 20,
            paddingHorizontal: 10,
            marginVertical: '10%',
          }}
          onPress={() => navigation.navigate('SwipeAI')}>
          <View
            style={{
              marginRight: '5%',
  
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialIcon size={50} name="swipe" color={theme.APP_COLOR} />
          </View>
          <Text style={styles.buttonText}>Work on images</Text>
        </Ripple>
        <FlatList
          style={{flex: 1, paddingTop: '3%'}}
          contentContainerStyle={{paddingBottom: '5%'}}
          showsVerticalScrollIndicator={false}
          data={options}
          renderItem={({item}) => (
            <Ripple
              onPress={() => navigation.navigate(item.screen)}
              key={item.id}
              outerStyle={{
                width: '45.9%',
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
                shadowOffset: {width: 0, height: 4},
                elevation: 5,
                margin: '2%',
                borderRadius: 25,
                backgroundColor: '#F5F6FC',
              }}
              innerStyle={{
                padding: '10%',
                marginBottom: '28.5%',
              }}>
              <item.Icon
                style={styles.icon}
                name={item.icon}
                size={39}
                color={theme.APP_COLOR}
              />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </Ripple>
          )}
          numColumns={2}
        />
      </View>
    );
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
)(LandingPage);

const styles = StyleSheet.create({
  itemTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#41474E',
    fontWeight: '600',
    marginTop: '9%',
  },
  icon: {
    marginVertical: '5%',
  },
  buttonText: {
    color: '#000',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    alignSelf: 'flex-end',
  },
  buttonImage: {
    height: 100,
    width: 100,
  },
});
