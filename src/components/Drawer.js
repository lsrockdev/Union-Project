import moment from 'moment';
import {theme} from './theme';
import Ripple from './Ripple';
import {Image, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useStateValue} from '../services/State/State';
import {settings as s} from '../services/API/Settings';
import {getLastActivity} from '../services/DataManager';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const Drawer = ({navigation, ...props}) => {
  useEffect(() => {
    getLastActivity().then((lastActivity) => {
      if (lastActivity) setLastActivity(lastActivity);
    });
  }, [props]);

  const [{user}] = useStateValue();
  const [lastActivity, setLastActivity] = useState(new Date());

  const drawerMenu = [
    {
      icon: (
        <MaterialCommunityIcon
          name="view-dashboard-outline"
          color="#000"
          size={20}
        />
      ),
      title: 'Dashboard',
      subTitle: 'Updates',
      onPress: () => navigation.navigate('Home'),
    },
    {
      icon: (
        <Image
          style={{height: 25, width: 25}}
          source={require('../assets/ShareRideBlack.png')}
        />
      ),
      title: 'Share Ride',
      subTitle: 'Share your Ride',
      onPress: () => navigation.navigate('ShareRide'),
    },
    {
      icon: (
        <Image
          style={{height: 25, width: 25}}
          source={require('../assets/ShareRideBlack.png')}
        />
      ),
      title: 'Post Ride',
      subTitle: 'Post your Ride',
      onPress: () => navigation.navigate('PostRide'),
    },
    {
      icon: (
        <Image
          style={{height: 25, width: 25}}
          source={require('../assets/SharedRides.png')}
        />
      ),
      title: 'Rides Shared',
      subTitle: 'Ride History',
      onPress: () => navigation.navigate('SharedRides'),
    },
    {
      icon: (
        <Image
          style={{height: 25, width: 25}}
          source={require('../assets/LookingForRideBlack.png')}
        />
      ),
      title: 'Looking for Ride',
      subTitle: 'Search for Rides',
      onPress: () => navigation.navigate('RideSearch'),
    },
    {
      icon: (
        <Image
          style={{height: 20, width: 20}}
          source={require('../assets/YourRides.png')}
        />
      ),
      title: 'Your Rides',
      subTitle: 'Ride History',
      onPress: () => navigation.navigate('YourRides'),
    },
  ];

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 0.25,
          alignItems: 'center',
          borderBottomWidth: 0.5,
          justifyContent: 'center',
          borderBottomColor: '#2c2e3d',
        }}>
        <View
          style={{
            padding: 3,
            borderWidth: 1,
            borderRadius: 50,
            borderColor: '#67c590',
          }}>
          <Image
            style={styles.image}
            source={
              user && user.image
                ? {uri: `${s.baseUrl}/${user.image}`}
                : require('../assets/userAvator.png')
            }
          />
          <View
            style={{
              top: 0,
              right: 0,
              padding: 2,
              borderRadius: 25,
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#67c590',
            }}>
            <MaterialIcon name="verified-user" color={'#fff'} size={20} />
          </View>
        </View>
        <View
          style={{
            marginTop: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{fontWeight: 'bold', color: '#000', textAlign: 'center'}}>
            {`${user.firstName ? user.firstName : 'Welcome'} ${
              user.lastName ? user.lastName : 'User'
            }`}
          </Text>
          <View
            style={{
              marginTop: 3,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text style={{color: '#818b99', fontSize: 10}}>Last Activity:</Text>
            <Text style={{color: '#67c590', fontSize: 10}}>
              {` ${moment(lastActivity).format('MMM DD, YYYY - hh:mm A')}`}
            </Text>
          </View>
        </View>
      </View>
      <View style={{flex: 0.7}}>
        {drawerMenu.map((menuItem, index) => (
          <Ripple
            key={index}
            innerStyle={{
              paddingVertical: 10,
              flexDirection: 'row',
              paddingHorizontal: 5,
              alignItems: 'center',
              borderBottomWidth: 0.5,
              justifyContent: 'center',
              borderBottomColor: '#2c2e3d',
            }}
            onPress={menuItem.onPress}>
            <View
              style={{
                flex: 0.15,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {menuItem.icon}
            </View>
            <View style={{flex: 0.8}}>
              <Text style={{fontWeight: 'bold', color: '#000', fontSize: 12}}>
                {menuItem.title}
              </Text>
              <Text style={{color: '#000', fontSize: 10, marginTop: 2}}>
                {menuItem.subTitle}
              </Text>
            </View>
            <View style={{flex: 0.05}}>
              <IonIcon name="chevron-forward-outline" color="#000" size={10} />
            </View>
          </Ripple>
        ))}
      </View>
    </View>
  );
};

export default Drawer;

const styles = {
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  profileImage: {
    flex: 1,
    padding: 10,
    width: '100%',
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
    paddingVertical: 10,
    fontFamily: theme.APP_FONT_FAMILY_B,
  },
  genderAndAge: {
    color: 'white',
    fontSize: 14,
    paddingRight: 10,
    fontFamily: theme.APP_FONT_FAMILY,
  },
  location: {
    color: 'white',
    fontSize: 14,
    paddingLeft: 10,
    fontFamily: theme.APP_FONT_FAMILY,
  },
  image: {
    width: 90,
    height: 90,
    padding: 10,
    borderRadius: 45,
    alignSelf: 'center',
  },
};
