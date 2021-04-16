import React from 'react';
import {View, Image} from 'react-native';
import Ripple from '../components/Ripple';
import {theme} from '../services/Common/theme';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const SwipeAI = () => {
  return (
    <View
      style={{
        flex: 1,
        marginTop: '2%',
        paddingTop: '5%',
        alignItems: 'center',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: theme.COLORS.WHITE,
      }}>
      <Image
        resizeMode="stretch"
        style={{height: '100%', width: 160, marginVertical: 20, flex: 0.25}}
        source={require('../assets/top_image.png')}
      />
      <Image
        resizeMode="stretch"
        style={{height: '100%', width: '100%', flex: 0.6}}
        source={require('../assets/bottom_image.png')}
      />
      <View
        style={{
          marginTop: '5%',
          flex: 0.15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ripple
          outerStyle={{
            borderWidth: 4,
            borderRadius: 25,
            borderColor: '#F3F0F3',
            marginTop: '-5%',
            marginRight: '-1%',
          }}
          innerStyle={{padding: 7}}
          onPress={() => {}}>
          <MaterialCommunityIcon name="reload" size={20} color="#dccd96" />
        </Ripple>
        <Ripple
          outerStyle={{
            borderWidth: 6,
            borderRadius: 50,
            borderColor: '#F3F0F3',
            marginRight: '-0.5%',
          }}
          innerStyle={{padding: 10}}
          onPress={() => {}}>
          <MaterialCommunityIcon name="close-thick" size={35} color="#cc1c26" />
        </Ripple>
        <Ripple
          outerStyle={{
            borderWidth: 6,
            borderRadius: 50,
            borderColor: '#F3F0F3',
            marginLeft: '-0.5%',
          }}
          innerStyle={{padding: 10}}
          onPress={() => {}}>
          <MaterialCommunityIcon name="check-bold" size={35} color="#76b772" />
        </Ripple>
        <Ripple
          outerStyle={{
            borderWidth: 4,
            borderRadius: 25,
            borderColor: '#F3F0F3',
            marginTop: '-5%',
            marginLeft: '-1%',
          }}
          innerStyle={{padding: 7}}
          onPress={() => {}}>
          <MaterialIcon name="arrow-right-alt" size={20} color="#dccd96" />
        </Ripple>
      </View>
    </View>
  );
};

export default SwipeAI;
