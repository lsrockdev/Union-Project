import React from 'react';
import Ripple from '../components/Ripple';
import {theme} from '../services/Common/theme';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Text, View, StyleSheet, FlatList} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const LandingPage = ({navigation}) => {
  const options = [
    {
      title: 'My Stats',
      screen: 'MyStats',
      icon: 'analytics-sharp',
      Icon: IonIcon,
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
      icon: 'info',
      title: 'Info',
      screen: 'About',
      Icon: MaterialIcon,
    },
    {
      title: 'Wallet',
      screen: 'Wallet',
      icon: 'account-balance-wallet',
      Icon: MaterialIcon,
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
        <Text style={styles.buttonText}>Swipe AI</Text>
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
};

export default LandingPage;

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
