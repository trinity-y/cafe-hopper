import client from './base';

const getBlend = async (uid) => {
  try {
    const response = await client.get(`/blend/${uid}`);
    console.log(response.data);
    return response.data;
  } catch (e) {
    console.error(e);
  }
};

const blendAPI = {
  getBlend
};

export default blendAPI;