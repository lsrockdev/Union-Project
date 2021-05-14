import {settings as s} from './Settings';
import {setLastActivity} from '../DataManager';

const getEndpointUrl = ep => `${s.baseUrl}${ep}`;

export const getData = async relativeUrl => {
  try {
    setLastActivity();
    const url = getEndpointUrl(relativeUrl);
    const config = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MTg5MDk0OTIsIm5iZiI6MTYxODkwOTQ5MiwianRpIjoiMzM2ZTk5YjAtM2ZkNC00NDQ4LTlhZDMtZTg1ZGRjYTI0ZWRkIiwiZXhwIjoxNjIxNTAxNDkyLCJpZGVudGl0eSI6IjB4ZTJDNjhDNThlQ2I0ODA3OGMzZjAzRmVjRUY1MTUzOGFBOGYxNDdBRSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.TUKOUTdJkGkr9TBYWBUKYgTSY1QPkyUFDRKRgiHtfeI',
      },
    };
    const response = await fetch(url, config);
    const result = await response.json();
    return result;
  } catch (err) {
    return null;
  }
};

export const getUserData = async relativeUrl => {
  try {
    setLastActivity();
    const refreshToken = await postUserData(s.taxonomy.refreshToken, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MjA2NTc3MzUsIm5iZiI6MTYyMDY1NzczNSwianRpIjoiNDFmOWExN2QtNGVhMS00ZDc1LWEwZWMtYTdiN2E3ODQ2NjRjIiwiZXhwIjoxNjIzMjQ5NzM1LCJpZGVudGl0eSI6IjB4ZjRGYjk2ODQ2NzY1NzMxZmI4MjY2RWI2MUY1QTczMzgwN2FBODhDMiIsInR5cGUiOiJyZWZyZXNoIn0.RAZDRvZKsMxZ-LajiCBXuR0ck6OIUM_t84mQR5Ps-QA');
    const url = getEndpointUrl(relativeUrl);
    const config = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          `Bearer ${refreshToken.access_token}`,
      },
    };
    const response = await fetch(url, config);
    const result = await response.json();
    return result;
  } catch (err) {
    return null;
  }
}

export const getFile = async relativeUrl => {
  try {
    setLastActivity();
    const url = getEndpointUrl(relativeUrl);
    const config = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MTg5MDk0OTIsIm5iZiI6MTYxODkwOTQ5MiwianRpIjoiMzM2ZTk5YjAtM2ZkNC00NDQ4LTlhZDMtZTg1ZGRjYTI0ZWRkIiwiZXhwIjoxNjIxNTAxNDkyLCJpZGVudGl0eSI6IjB4ZTJDNjhDNThlQ2I0ODA3OGMzZjAzRmVjRUY1MTUzOGFBOGYxNDdBRSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.TUKOUTdJkGkr9TBYWBUKYgTSY1QPkyUFDRKRgiHtfeI',
      },
    };
    const response = await fetch(url, config);
    const result = await response.blob();
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
      Authorization:
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MTg5MDk0OTIsIm5iZiI6MTYxODkwOTQ5MiwianRpIjoiMzM2ZTk5YjAtM2ZkNC00NDQ4LTlhZDMtZTg1ZGRjYTI0ZWRkIiwiZXhwIjoxNjIxNTAxNDkyLCJpZGVudGl0eSI6IjB4ZTJDNjhDNThlQ2I0ODA3OGMzZjAzRmVjRUY1MTUzOGFBOGYxNDdBRSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.TUKOUTdJkGkr9TBYWBUKYgTSY1QPkyUFDRKRgiHtfeI',
    },
  };
  if (data) {
    config.body = isFormData ? data : JSON.stringify(data);
  }
  try {
    const response = await fetch(url, config)
      .then(res => res.json())
      .then(res => res)
      .catch(error => error);
    return response;
  } catch (err) {
    return null;
  }
};

export const postUserData = async (
  relativeUrl,
  accessToken,
  data = null,
  isFormData = false,
) => {
  setLastActivity();
  const url = getEndpointUrl(relativeUrl);
  const config = {
    method: 'post',
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      Authorization:
        `Bearer ${accessToken}`,
    },
  };
  if (data) {
    config.body = isFormData ? data : JSON.stringify(data);
  }
  try {
    const response = await fetch(url, config)
      .then(res => res.json())
      .then(res => res)
      .catch(error => error);
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
      .then(res => res.json())
      .then(res => res)
      .catch(error => error);
    return response;
  } catch (err) {
    return null;
  }
};
