import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ACCEPTED_PRIVACY_AND_TERMS: 'ACCEPTED_PRIVACY_AND_TERMS',
  USER_INFO: 'USER_INFO',
  LAST_ACTIVITY: 'LAST_ACTIVITY',
  AUTH_TOKEN: 'AUTH_TOKEN',
  WALLET_KEY: '@save_Keys'
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


export const setAuthToken = async (authToken) => {
  try {
    await AsyncStorage.setItem(KEYS.AUTH_TOKEN, JSON.stringify(authToken));
  } catch (err) {
    return null;
  }
};

export const getAuthToken = async () => {
  try {
    const response = await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
    if (response) {
      return JSON.parse(response);
    }
    return null;
  } catch (err) {
    return null;
  }
};


export const setWalletData = async(walletData) => {
  try {
    await AsyncStorage.setItem(KEYS.WALLET_KEY, JSON.stringify(walletData));
  } catch (err) {
    return null;
  }
}

export const getWalletData = async () => {
  try {
    const response = await AsyncStorage.getItem(KEYS.WALLET_KEY);
    if (response) {
      return JSON.parse(response);
    }
    return null;
  } catch (err) {
    return null;
  }
};

