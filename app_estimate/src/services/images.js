import axios from "axios";
import html2canvas from "html2canvas";
import { BASE_URL } from "../utils/constants";

export const getImages = async (id) => {
  var result = null;
  /*
  const tokenString = localStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  */
  let url = `${BASE_URL}/api/image/get`;

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

export const getCommentCount = async (id) => {
  var result = null;
  /*
  const tokenString = localStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  */
  let url = `${BASE_URL}/api/image/count/get`;

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
      console.log(err);
      result = {
        status: "desconnected",
        message: "No internet connection",
      };
    });

  return result;
};

export const getComments = async (id) => {
  var result = null;
  /*
  const tokenString = localStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  */
  let url = `${BASE_URL}/api/image/comment/get`;

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

export const addComment = async (data) => {
  var result = null;
  /*
  const tokenString = localStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  */
  let url = `${BASE_URL}/api/image/comment/add`;

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

export const deleteComment = async (id) => {
  var result = null;
  /*
  const tokenString = localStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  */
  let url = `${BASE_URL}/api/image/comment/delete`;

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

export const getPrintMapImage = async (printType, setPrintValue, map) => {
  if (!map) return;
  setPrintValue(printType);
  return new Promise((resolve) => {
    setTimeout(function () {
      //let canvas = map.getCanvas();
      //let image = canvas.toDataURL("image/jpeg", 0.7);
      let mapContainer = map.getContainer();
      let parentContainer = mapContainer.parentNode; // or parentElement
      html2canvas(parentContainer).then(function (canvas) {
        let image = canvas.toDataURL("image/jpeg", 0.7);
        resolve(image);
      });
    }, 1000);
  });
};
