import axios from "axios";

const BASE_URL = "http://localhost:5068";

export const getDataAPI = async (url, token = null) => {
  const res = await axios.get(`${BASE_URL}/api/${url}`, {
    headers: token ? { Authorization: `${token}` } : {},
  });
  return res;
};

export const postDataAPI = async (url, post, token = null) => {
  const res = await axios.post(`${BASE_URL}/api/${url}`, post, {
    headers: token ? { Authorization: `${token}` } : {},
  });
  return res;
};

export const putDataAPI = async (url, post, token = null) => {
  const res = await axios.put(`${BASE_URL}/api/${url}`, post, {
    headers: token ? { Authorization: `${token}` } : {},
  });
  return res;
};

export const patchDataAPI = async (url, post, token = null) => {
  const res = await axios.patch(`${BASE_URL}/api/${url}`, post, {
    headers: token ? { Authorization: `${token}` } : {},
  });
  return res;
};

export const deleteDataAPI = async (url, token = null) => {
  const res = await axios.delete(`${BASE_URL}/api/${url}`, {
    headers: token ? { Authorization: `${token}` } : {},
  });
  return res;
};
