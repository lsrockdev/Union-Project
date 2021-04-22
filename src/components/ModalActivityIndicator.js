import React from 'react';
import {ActivityIndicator, Image, Modal, View, Text} from 'react-native';
import {theme} from '../services/Common/theme';

const ModalActivityIndicator = props => {
  const {modalVisible} = props || {};

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      statusBarTranslucent={true}>
      <View style={{flex: 1, backgroundColor: 'rgba(52,52,52,0.5)'}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            resizeMode="stretch"
            style={{
              width: 100,
              height: 60,
            }}
            source={require('../assets/icon.png')}
          />
          <ActivityIndicator
            size={20}
            color={theme.COLORS.WHITE}
            style={{
              left: '12%',
              right: 0,
              top: '46.5%',
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
          <Text style={{color: theme.COLORS.WHITE, marginTop: 10}}>
            Please Wait...
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default ModalActivityIndicator;
