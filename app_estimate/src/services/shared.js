import axios from "axios";
import { BASE_URL } from "../utils/constants";

export const getShared = async (id) => {
  var result = null;
  let url = `${BASE_URL}/api/measurement/share/get`;

  await axios
    .get(url, {
      params: {
        id: id,
      },
    })
    .then((response) => {
      result = response.data;
    })
    .catch((err) => {
      result = {
        status: "desconnected",
        message: "No internet connection",
      };
    });

  return result;
};

export const addShared = async (data) => {
  var result = null;
  let url = `${BASE_URL}/api/measurement/share/addUpdate`;

  await axios
    .post(url, data)
    .then((response) => {
      result = response.data;
    })
    .catch((err) => {
      result = {
        status: "desconnected",
        message: "No internet connection",
      };
    });

  return result;
};

export const deleteShared = async (id) => {
  var result = null;
  let url = `${BASE_URL}/api/measurement/share/delete`;

  await axios
    .delete(url, {
      params: {
        id: id,
      },
    })
    .then((response) => {
      result = response.data;
    })
    .catch((err) => {
      result = {
        status: "desconnected",
        message: "No internet connection",
      };
    });

  return result;
};
