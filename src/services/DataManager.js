import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ACCEPTED_PRIVACY_AND_TERMS: 'ACCEPTED_PRIVACY_AND_TERMS',
  USER_INFO: 'USER_INFO',
  LAST_ACTIVITY: 'LAST_ACTIVITY',
};

export const setUserInfo = async (userDetails) => {
  try {
    await AsyncStorage.setItem(KEYS.USER_INFO, JSON.stringify(userDetails));
  } catch (err) {
    return null;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await AsyncStorage.getItem(KEYS.USER_INFO);
    if (response) {
      return JSON.parse(response);
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const setPrivacyAndTermsAccepted = async () => {
  try {
    await AsyncStorage.setItem(
      KEYS.ACCEPTED_PRIVACY_AND_TERMS,
      JSON.stringify(true),
    );
    return true;
  } catch (err) {
    return null;
  }
};

export const isPrivacyAndTermsAccepted = async () => {
  try {
    const response = await AsyncStorage.getItem(
      KEYS.ACCEPTED_PRIVACY_AND_TERMS,
    );
    if (response && JSON.parse(response)) {
      return true;
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const setLastActivity = async () => {
  try {
    await AsyncStorage.setItem(KEYS.LAST_ACTIVITY, JSON.stringify(new Date()));
  } catch (err) {
    return null;
  }
};

export const getLastActivity = async () => {
  try {
    const response = await AsyncStorage.getItem(KEYS.LAST_ACTIVITY);
    if (response) {
      return JSON.parse(response);
    }
    return null;
  } catch (err) {
    return null;
  }
};