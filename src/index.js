import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
enableScreens();
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabComponent from './components/Tab';
import {StyleSheet, Image} from 'react-native';
import Loading from './screens/Loading';
import LandingPage from './screens/LandingPage';
import About from './screens/About';
import Stats from './screens/Stats';
import SwipeAI from './screens/SwipeAI';
import Learn from './screens/Learn';
import Wallet from './screens/Wallet';
//import Wallets from './screens/Wallets';
//import MyWallet from '../wallet/App';
import walletEntry from '../walletEntry'
import MyStats from './screens/MyStats';
import Ripple from './components/Ripple';
import {theme} from './services/Common/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const styles = StyleSheet.create({
  leftIcon: {
    width: 40,
    height: 24,
  },
  rightIcon: {
    width: 32,
    height: 30,
  },
  leftButton: {
    marginLeft: 5,
    borderRadius: 10,
  },
  rightButton: {
    marginRight: 5,
    borderRadius: 10,
  },
});

const Header = (
  {
    title = null,
    showTitle = false,
    showAppIcon = false,
    isTransparent = false,
    showRightButton = false,
  },
  navigation,
) => ({
  title: showTitle ? title : null,
  headerTitleStyle: {
    color: theme.COLORS.WHITE,
  },
  headerStyle: {
    shadowOpacity: 0,
    elevation: isTransparent ? 0 : 4,
    backgroundColor: theme.APP_COLOR,
  },
  headerLeft: showAppIcon
    ? () => (
        <Ripple
          onPress={() => navigation.navigate('LandingPage')}
          outerStyle={styles.leftButton}
          innerStyle={{padding: 10}}>
          <Image
            style={styles.leftIcon}
            resizeMode="stretch"
            source={require('./assets/icon.png')}
          />
        </Ripple>
      )
    : null,
  headerRight: showRightButton
    ? () => (
        <Ripple
          onPress={() => alert('Pressed')}
          outerStyle={styles.rightButton}
          innerStyle={{padding: 5}}>
          <Image
            style={styles.rightIcon}
            resizeMode="stretch"
            source={require('./assets/menu.png')}
          />
        </Ripple>
      )
    : null,
});

const LandingPageStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="LandingPage"
      component={LandingPage}
      options={({navigation}) => {
        return Header(
          {
            showTitle: false,
            showAppIcon: true,
            isTransparent: true,
          },
          navigation,
        );
      }}
    />
  </Stack.Navigator>
);

const AboutStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="About"
      component={About}
      options={({navigation}) => {
        return Header(
          {
            showTitle: false,
            showAppIcon: true,
            isTransparent: true,
            showRightButton: true,
          },
          navigation,
        );
      }}
    />
  </Stack.Navigator>
);

const StatsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Stats"
      component={Stats}
      options={({navigation}) => {
        return Header(
          {
            showTitle: false,
            showAppIcon: true,
            isTransparent: true,
            showRightButton: true,
          },
          navigation,
        );
      }}
    />
  </Stack.Navigator>
);

const LearnStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Learn"
      component={Learn}
      options={({navigation}) => {
        return Header(
          {
            showTitle: false,
            showAppIcon: true,
            isTransparent: true,
            showRightButton: true,
          },
          navigation,
        );
      }}
    />
  </Stack.Navigator>
);

const SwipeAIStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SwipeAI"
      component={SwipeAI}
      options={({navigation}) =>
        Header(
          {
            showTitle: false,
            showAppIcon: true,
            isTransparent: true,
            showRightButton: true,
          },
          navigation,
        )
      }
    />
  </Stack.Navigator>
);

const WalletStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Wallet"
      component={walletEntry}
      options={({navigation}) => {
        return Header(
          {
            showTitle: false,
            showAppIcon: true,
            isTransparent: true,
            showRightButton: true,
          },
          navigation,
        );
      }}
    />
  </Stack.Navigator>
);

const MyStatsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MyStats"
      component={MyStats}
      options={({navigation}) => {
        return Header(
          {
            showTitle: false,
            showAppIcon: true,
            isTransparent: true,
            showRightButton: true,
          },
          navigation,
        );
      }}
    />
  </Stack.Navigator>
);

const BottomTabs = () => (
  <Tab.Navigator
    tabBarOptions={{
      style: {
        height: 60,
        backgroundColor: '#F2F2F2',
        elevation: 3,
        shadowColor: theme.APP_COLOR,
        shadowOffset: {
          width: 5,
          height: 5,
        },
        shadowOpacity: 0.5,
        borderTopColor: '#C2C2C2',
        borderTopWidth: 1,
      },
    }}>
    <Tab.Screen
      name="LandingPage"
      component={LandingPageStack}
      options={{
        unmountOnBlur: true,
        tabBarButton: () => null,
      }}
    />
    <Tab.Screen
      name="About"
      component={AboutStack}
      options={{
        unmountOnBlur: true,
        // eslint-disable-next-line react/display-name
        tabBarButton: props => <TabComponent label="About" {...props} />,
      }}
    />
    <Tab.Screen
      name="Stats"
      component={StatsStack}
      options={{
        unmountOnBlur: true,
        // eslint-disable-next-line react/display-name
        tabBarButton: props => <TabComponent label="Stats" {...props} />,
      }}
    />
    <Tab.Screen
      name="SwipeAI"
      component={SwipeAIStack}
      options={{
        unmountOnBlur: true,
        tabBarVisible: false,
        // eslint-disable-next-line react/display-name
        tabBarButton: props => <TabComponent label="SwipeAI" {...props} />,
      }}
    />
    <Tab.Screen
      name="Learn"
      component={LearnStack}
      options={{
        unmountOnBlur: true,
        // eslint-disable-next-line react/display-name
        tabBarButton: props => <TabComponent label="Learn" {...props} />,
      }}
    />

    <Tab.Screen
      name="Wallet"
      component={WalletStack}
      options={{
        unmountOnBlur: true,
        // eslint-disable-next-line react/display-name
        tabBarButton: props => <TabComponent label="Wallet" {...props} />,
      }}
    />
    <Tab.Screen
      name="MyStats"
      component={MyStatsStack}
      options={{
        unmountOnBlur: true,
        // eslint-disable-next-line react/display-name
        tabBarButton: props => <TabComponent label="MyStats" {...props} />,
      }}
    />
  </Tab.Navigator>
);

const RootStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Loading"
      component={Loading}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="Home"
      component={BottomTabs}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const CreateRootNavigator = () => {
  return (
    <NavigationContainer theme={{colors: {background: theme.APP_COLOR}}}>
      <RootStack />
    </NavigationContainer>
  );
};

export default CreateRootNavigator;
