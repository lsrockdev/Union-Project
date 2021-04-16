import React, {useState, useRef, useEffect} from 'react';
import {View, TextInput, Keyboard} from 'react-native';

const VerificationCodeInput = (props) => {
  useEffect(() => {
    inputRef[0].focus();
  }, [inputRef && inputRef.length > 0]);

  const {onChange = () => {}} = props || {};

  const [codeDigits, setCodeDigits] = useState(new Array(6).fill(''));
  const [focusedInput, setFocusedInput] = useState(0);

  const inputRef = new Array(6).fill(useRef());

  const onInput = (digit, index) => {
    const updatedCodeDigits = codeDigits;
    updatedCodeDigits[index] = digit;
    setCodeDigits(updatedCodeDigits);
    onChange(updatedCodeDigits.join(''));
    if (digit) {
      if (inputRef[index + 1]) {
        inputRef[index + 1].focus();
      }
      if (index === codeDigits.length - 1) {
        setFocusedInput(-1);
        Keyboard.dismiss();
      }
    } else {
      if (inputRef[index - 1]) {
        inputRef[index - 1].focus();
      }
    }
  };

  const onSubmit = (index) => {
    if (index < codeDigits.length - 1) {
      inputRef[index + 1].focus();
    }
    if (index === codeDigits.length - 1) {
      setFocusedInput(-1);
      Keyboard.dismiss();
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {new Array(6).fill().map((item, index) => (
        <View
          key={index}
          style={{
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: '2%',
            paddingHorizontal: '1%',
            backgroundColor: '#fff',
            elevation: 5,
            shadowRadius: 2,
            shadowOpacity: 0.3,
            shadowOffset: {
              width: 0,
              height: 2,
            },
          }}>
          <TextInput
            maxLength={1}
            keyboardType="phone-pad"
            selectTextOnFocus={true}
            ref={(ref) => (inputRef[index] = ref)}
            style={{
              textAlign: 'center',
              height: 45,
              width: 30,
            }}
            onFocus={() => setFocusedInput(index)}
            onSubmitEditing={() => onSubmit(index)}
            onChangeText={(digit) => onInput(digit, index)}
          />
          <View
            style={{
              position: 'absolute',
              bottom: '9%',
              left: '25%',
              right: '25%',
              borderBottomWidth: 2,
              borderBottomColor:
                focusedInput === index ||
                codeDigits[index] ||
                codeDigits[index] === 0
                  ? '#00a9a5'
                  : 'lightgray',
            }}
          />
        </View>
      ))}
    </View>
  );
};

export default VerificationCodeInput;
