import axios from "axios";

const BASE_URL = "http://172.188.193.248/account";

export const getDataAPI = async (url, token) => {
  const res = await axios.get(`${BASE_URL}/${url}`, {
    headers: { Authorization: token },
    withCredentials: true,
  });
  return res;
};

export const postDataAPI = async (url, post, token) => {
  const res = await axios.post(`${BASE_URL}/${url}`, post, {
    headers: { Authorization: token },
    withCredentials: true,
  });
  return res;
};

export const putDataAPI = async (url, post, token) => {
  const res = await axios.put(`${BASE_URL}/${url}`, post, {
    header: { Authorization: token },
    withCredentials: true,
  });
  return res;
};

export const patchDataAPI = async (url, post, token) => {
  const res = await axios.patch(`${BASE_URL}/${url}`, post, {
    header: { Authorization: token },
    withCredentials: true,
  });
  return res;
};

export const deleteDataAPI = async (url, token) => {
  const res = await axios.delete(`${BASE_URL}/${url}`, {
    header: { Authorization: token },
    withCredentials: true,
  });
  return res;
};
