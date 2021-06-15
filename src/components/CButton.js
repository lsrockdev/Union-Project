import React from 'react';
import {TouchableOpacity, Text, StyleSheet,ToastAndroid, View} from 'react-native';
import Ripple from '../components/Ripple';
import Clipboard from '@react-native-community/clipboard';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const CButton = ({text}) => {
 const onCopy = () => {
        Clipboard.setString(text);
        ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
      };

  return (
    <Ripple
      onPress={onCopy}
      outerStyle={{borderRadius: 10, flex: 1, alignItems: 'flex-end'}}
      innerStyle={{padding: 10}}>
          
    <MaterialIcon size={25} name="content-copy" color="#6c6c6c" />

    </Ripple>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    padding: 18,
    width: '46%',
    height: 60,
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default CButton;