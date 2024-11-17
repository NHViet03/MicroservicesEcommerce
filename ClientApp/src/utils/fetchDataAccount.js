import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const getDataAPI = async (url) => {
  const res = await axios.get(`${BASE_URL}/api/${url}`, {});
  return res;
};

export const postDataAPI = async (url, post) => {
  const res = await axios.post(`${BASE_URL}/api/${url}`, post, {});
  return res;
};

export const putDataAPI = async (url, post) => {
  const res = await axios.put(`${BASE_URL}/api/${url}`, post, {});
  return res;
};

export const patchDataAPI = async (url, post) => {
  const res = await axios.patch(`${BASE_URL}/api/${url}`, post, {});
  return res;
};

export const deleteDataAPI = async (url) => {
  const res = await axios.delete(`${BASE_URL}/api/${url}`, {});
  return res;
};
