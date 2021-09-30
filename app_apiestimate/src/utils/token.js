import jwt from "jsonwebtoken";

export let verifyToken = function (token) {
  return new Promise((resolve, reject) => {
    let result;
    jwt.verify(token, "RoofAPI", async (err, user) => {
      if (err) {
        result = {
          status: "failed-token",
          message: "Failed to authenticate token.",
        };
        reject(result);
      } else {
        result = {
          status: "ok",
          access: user,
        };
        resolve(result);
      }
    });
  });
};

export let signToken = function (data) {
  return new Promise((resolve, reject) => {
    return jwt.sign(data, "RoofAPI", { expiresIn: "1h" });
  });
};
