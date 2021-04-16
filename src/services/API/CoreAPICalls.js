import {settings as s} from './Settings';
import {setLastActivity} from '../DataManager';

const getEndpointUrl = (ep) => `${s.baseUrl}${ep}`;

export const getData = async (relativeUrl) => {
  try {
    setLastActivity();
    const url = getEndpointUrl(relativeUrl);
    const config = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(url, config);
    const result = await response.json();
    return result;
  } catch (err) {
    return null;
  }
};

export const postData = async (
  relativeUrl,
  data = null,
  isFormData = false,
) => {
  setLastActivity();
  const url = getEndpointUrl(relativeUrl);
  const config = {
    method: 'post',
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
  };
  if (data) {
    config.body = isFormData ? data : JSON.stringify(data);
  }
  try {
    const response = await fetch(url, config)
      .then((res) => res.json())
      .then((res) => res)
      .catch((error) => error);
    return response;
  } catch (err) {
    return null;
  }
};

export const putData = async (relativeUrl, data = null, isFormData = false) => {
  setLastActivity();
  const url = getEndpointUrl(relativeUrl);
  const config = {
    method: 'put',
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
  };
  if (data) {
    config.body = isFormData ? data : JSON.stringify(data);
  }
  try {
    const response = await fetch(url, config)
      .then((res) => res.json())
      .then((res) => res)
      .catch((error) => error);
    return response;
  } catch (err) {
    return null;
  }
};
