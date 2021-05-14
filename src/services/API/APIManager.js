import {getData, getFile, postData, getUserData} from './CoreAPICalls';
import {settings as s} from './Settings';

export const getAllImages = async () => {
  try {
    const response = await getData(s.taxonomy.getImages);
    return response;
  } catch (err) {
    return null;
  }
};

export const getOverall = async (start, end) => {
  try {
    const response = await getData(s.taxonomy.overall.replace('$[start_date]', start).replace('$[end_date]', end));
    return response;
  } catch (err) {
    return null;
  }
};

export const getUserStats = async (start, end) => {
  try {
    const response = await getUserData(s.taxonomy.userStats.replace('$[start_date]', start).replace('$[end_date]', end));
    return response;
  } catch (err) {
    return null;
  }
};

export const getImage = async imageId => {
  try {
    const response = await getFile(
      s.taxonomy.getImage.replace('$[image_id]', imageId),
    );
    return response;
  } catch (err) {
    return null;
  }
};

export const storeUserResponse = async data => {
  try {
    const response = await postData(s.taxonomy.storeUserResponse, data);
    return response;
  } catch (err) {
    return null;
  }
};
