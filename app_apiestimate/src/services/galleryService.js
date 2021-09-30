import path from "path";
//import fs from "fs/promises";
import {promises as fs} from "fs";

import { query } from "../utils/authDB";
import { verifyToken } from "../utils/token";

class GalleryService {
  async getImages(auth, id) {
    var result;
    var data;
    var files = [];

    if (auth) {
      const token = auth.split(" ")[1];
      await verifyToken(token).then(async (verify) => {
        if (verify.status == "ok") {
          const dir_path = path.join(__dirname, "../../public/images/" + id);
          //passsing dir_path and callback function
          await fs
            .readdir(dir_path)
            .then(async (res) => {
              await Promise.all(
                res.map(async (file) => {
                  if (file !== "thumb.jpg") {
                    var query_db = `SELECT * FROM app_commentCount WHERE image_id='${file}'`;
                    const rows = await query(query_db);
                    if (rows.length > 0) {
                      data = {
                        img: file,
                        date: rows[0].create_time,
                        count: rows[0].count_comments,
                      };
                    } else {
                      data = {
                        img: file,
                        date: null,
                        count: 0,
                      };
                    }
                    files.push(data);
                  }
                })
              );
              result = {
                status: "success",
                images: files,
              };
            })
            .catch((err) => {
              result = {
                status: "error",
                message: err,
              };
            });
        } else {
          result = {
            status: "failed-token",
            message: "Failed to authenticate token.",
          };
        }
      });
    } else {
      result = {
        status: "failed-token",
        message: "Failed to authenticate token.",
      };
    }

    return result;
  }

  async getCommentCount(auth, id) {
    var result;

    if (auth) {
      const token = auth.split(" ")[1];
      await verifyToken(token).then(async (verify) => {
        if (verify.status == "ok") {
          var query_db = `SELECT * FROM app_commentCount WHERE image_id='${id}'`;
          const rows = await query(query_db);
          if (rows.length > 0) {
            result = {
              status: "success",
              date: rows[0].create_time,
              count: rows[0].count_comments,
            };
          } else {
            result = {
              status: "success",
              date: null,
              count: 0,
            };
          }
        } else {
          result = {
            status: "failed-token",
            message: "Failed to authenticate token.",
          };
        }
      });
    } else {
      result = {
        status: "failed-token",
        message: "Failed to authenticate token.",
      };
    }

    return result;
  }
}

export default new GalleryService();
