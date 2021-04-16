import {SafeAreaView, StatusBar, LogBox} from 'react-native';
import React, {useEffect} from 'react';
import CreateRootNavigator from './src/index';
import {StateProvider} from './src/services/State/State';
import {initialState} from './src/services/State/InitialState';
import {reducer, actions} from './src/services/State/Reducer';
import {useStateValue} from './src/services/State/State';
import ModalActivityIndicator from './src/components/ModalActivityIndicator';
import AppAlert from './src/components/AppAlert';
import {theme} from './src/services/Common/theme';
import {getUserInfo} from './src/services/DataManager';

const RootNavigator = () => {
  useEffect(() => {
    checkStatus();
  }, []);

  const [{progressSettings, alertSettings}, dispatch] = useStateValue();
  const {show = false} = progressSettings || {};
  const {settings} = alertSettings || {};

  const checkStatus = async () => {
    try {
      const userInfo = await getUserInfo();
      if (userInfo && userInfo.id) {
        dispatch({
          type: actions.SET_USER,
          user: userInfo,
        });
      } else {
        dispatch({
          type: actions.SET_USER,
          user: '',
        });
      }
      // eslint-disable-next-line no-empty
    } catch (err) {}
  };

  const getAlertSettings = () => {
    const onConfirmPressed =
        settings && settings.onConfirmPressed
          ? settings.onConfirmPressed
          : () => {},
      onCancelPressed =
        settings && settings.onCancelPressed
          ? settings.onCancelPressed
          : () => {};
    return {
      ...settings,
      onConfirmPressed: () => {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: null,
        });
        onConfirmPressed();
      },
      onCancelPressed: () => {
        dispatch({
          type: actions.SET_ALERT_SETTINGS,
          alertSettings: null,
        });
        onCancelPressed();
      },
    };
  };

  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: theme.APP_COLOR}} />
      <SafeAreaView style={{flex: 1, backgroundColor: theme.COLORS.WHITE}}>
        <StatusBar backgroundColor={theme.APP_COLOR} barStyle="dark-content" />
        <AppAlert {...getAlertSettings()} />
        <ModalActivityIndicator modalVisible={show} />
        <CreateRootNavigator />
      </SafeAreaView>
    </>
  );
};

const App = () => {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <RootNavigator />
    </StateProvider>
  );
};

export default App;

LogBox.ignoreAllLogs(true);
