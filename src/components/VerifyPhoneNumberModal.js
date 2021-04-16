import React, {useState} from 'react';
import {View, Modal, Text, StyleSheet} from 'react-native';
import Ripple from '../components/Ripple';
import PropTypes from 'prop-types';
import VerificationCodeInput from '../components/VerificationCodeInput';

const VerifyPhoneNumberModal = ({
  visible = false,
  phoneNumber = '',
  onClose = () => {},
  onVerify = () => {},
}) => {
  const [code, setCode] = useState('');

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      statusBarTranslucent={true}>
      <View style={styles.modalView}>
        <View style={styles.boxView}>
          <View style={styles.textBox}>
            <Text style={styles.title}>Verification Code</Text>
            <Text style={styles.message}>
              {`Please enter the verification code sent to your phone number: ${phoneNumber}`}
            </Text>
          </View>
          <VerificationCodeInput onChange={(code) => setCode(code)} />
          <View style={styles.actionBox}>
            <Ripple
              innerStyle={styles.actionButtonInner}
              outerStyle={{
                backgroundColor: '#ed3237',
                ...styles.actionButtonOuter,
              }}
              onPress={onClose}>
              <Text style={styles.actionButtonText}>Cancel</Text>
            </Ripple>
            <Ripple
              innerStyle={styles.actionButtonInner}
              outerStyle={{
                backgroundColor: '#67c590',
                ...styles.actionButtonOuter,
              }}
              onPress={() => onVerify(code)}>
              <Text style={styles.actionButtonText}>Verify</Text>
            </Ripple>
          </View>
        </View>
      </View>
    </Modal>
  );
};

VerifyPhoneNumberModal.propTypes = {
  visible: PropTypes.bool,
  phoneNumber: PropTypes.number,
  onClose: PropTypes.func,
  onVerify: PropTypes.func,
};

export default VerifyPhoneNumberModal;

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52,52,52,0.5)',
  },
  boxView: {
    marginHorizontal: '5%',
    paddingVertical: '3%',
    paddingHorizontal: '2%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    elevation: 5,
    shadowRadius: 2,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  textBox: {
    marginHorizontal: 10,
    marginTop: 5,
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  actionBox: {
    flexDirection: 'row',
    marginTop: '5%',
    borderWidth: 0,
  },
  actionButtonOuter: {
    flex: 1,
    margin: 5,
    borderRadius: 5,
  },
  actionButtonInner: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
  },
});
