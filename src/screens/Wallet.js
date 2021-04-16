import React from 'react';
import {Text, View} from 'react-native';
import Button from '../components/Button';
import CopyTextBox from '../components/CopyTextBox';
import {theme} from '../services/Common/theme';

const Wallet = () => {
  const credentials = [
    {
      oneLine: false,
      label: 'Memoric Phrase',
      value:
        'following guitar strings colors rainbow cranial nerves planets hello twitter follow kiss',
    },
    {
      oneLine: true,
      label: 'Password',
      value: '56/)&VS=DBLdjshBP',
    },
    {
      oneLine: true,
      label: 'Public Key',
      value:
        '0x046e386c879d76db3c6944b01e90e1f1825ff64ce1705ca91e76b2c3d8442a86b1ffc074fc5be1223944ad51966f485d5c912e62a128d16014b06f6ccf4068e9',
    },
    {
      oneLine: true,
      label: 'Private Key',
      value:
        '0xa1987de9a2694a9e176bec3c8666f87122f2d9b6ef9e6e3f039ff162e11867d6',
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        marginTop: '2%',
        paddingTop: '5%',
        paddingHorizontal: '4%',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: theme.COLORS.WHITE,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View>
          <Text
            style={{
              fontSize: 27,
              fontWeight: '600',
              lineHeight: 33,
              color: theme.APP_COLOR,
              fontFamily: 'Inter-Bold',
            }}>
            1.2 QUICRA-0
          </Text>
          <Text
            style={{
              color: '#8C98A9',
              fontFamily: 'Inter-Bold',
              fontSize: 20,
              fontWeight: '600',
            }}>
            7.2 Ocean
          </Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text
            style={{
              color: theme.COLORS.BLACK,
              fontSize: 16,
              fontFamily: 'Inter-Regular',
            }}>
            24h Portfolio
          </Text>
          <Text
            style={{
              color: '#84c380',
              fontSize: 20,
              fontFamily: 'Inter-Bold',
            }}>
            (+15.53%)
          </Text>
        </View>
      </View>
      <View style={{marginTop: '8%'}}>
        {credentials.map((item, index) => (
          <CopyTextBox key={index} item={item} />
        ))}
      </View>
      <Button
        color="#f2f2f2"
        title="Delete Wallet"
        buttonStyle={{
          borderRadius: 25,
          width: '70%',
          alignSelf: 'center',
        }}
        onPress={() => alert('Pressed')}
        textStyle={{
          fontSize: 19,
          fontWeight: '600',
          color: theme.APP_COLOR,
          fontFamily: 'Inter-Bold',
        }}
      />
    </View>
  );
};

export default Wallet;
