import {getData, getFile, postData} from './CoreAPICalls';
import {settings as s} from './Settings';

export const getAllImages = async () => {
  try {
    const response = await getData(s.taxonomy.getImages);
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
