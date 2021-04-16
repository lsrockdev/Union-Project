import {ActivityIndicator, Image, Modal, View} from 'react-native';
import React from 'react';

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
            source={require('../assets/icon.png')}
            style={{
              width: 120,
              height: 120,
            }}
          />
          <ActivityIndicator
            size={20}
            color="#3c1081"
            style={{
              left: 0,
              right: 0,
              top: '52.5%',
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ModalActivityIndicator;
