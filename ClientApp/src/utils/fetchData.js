import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const getDataAPI = async (url, token) => {
  const res = await axios.get(`${BASE_URL}/api/${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const postDataAPI = async (url, post, token) => {
  const res = await axios.post(`${BASE_URL}/api/${url}`, post, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const putDataAPI = async (url, post, token) => {
  const res = await axios.put(`${BASE_URL}/api/${url}`, post, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const patchDataAPI = async (url, post, token) => {
  const res = await axios.patch(`${BASE_URL}/api/${url}`, post, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const deleteDataAPI = async (url, token) => {
  const res = await axios.delete(`${BASE_URL}/api/${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};
