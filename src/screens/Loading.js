import React, {useEffect} from 'react';
import {Text, Image, View, StyleSheet} from 'react-native';
import {theme} from '../services/Common/theme';
import {CommonActions} from '@react-navigation/native';

const Loading = ({navigation}) => {
  useEffect(() => {
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
