import { query } from "../utils/authDB";
import { verifyToken } from "../utils/token";

class CommentService {
  async getComments(auth, id) {
    let result;
    let data;
    let array = [];

    try {
      if (auth) {
        const token = auth.split(" ")[1];
        await verifyToken(token)
          .then(async (verify) => {
            if (verify.status == "ok") {
              var query_db = `SELECT id, create_time as date, comment_text as text, user_email as email  FROM app_imageComments WHERE image_id='${id}' ORDER BY create_time desc`;
              await query(query_db)
                .then(async (rows) => {
                  await Promise.all(
                    rows.map(async (item) => {
                      var query_user = `SELECT name, profile_photo as img FROM app_users WHERE email='${item.email}'`;
                      await query(query_user)
                        .then((user) => {
                          data = {
                            id: item.id,
                            date: item.date ,
                            text: item.text,
                            email: item.email,
                            img: user[0].img,
                            name: user[0].name,
                          };

                          array.push(data);
                        })
                        .catch((err) => {
                          data = {
                            id: item.id,
                            date: item.date ,
                            text: item.text,
                            email: item.email,
                            img: "",
                            name: "",
                          };
                          array.push(data);
                        });
                    })
                  );
                  result = {
                    status: "success",
                    comments: array,
                  };
                })
                .catch((err) => {
                  result = {
                    status: "error",
                    message: err.toString(),
                  };
                });
            } else {
              result = {
                status: "failed-token",
                message: "Failed to authenticate token.",
              };
            }
          })
          .catch(() => {
            result = {
              status: "failed-token",
              message: "Failed to authenticate token.",
            };
          });
      } else {
        result = {
          status: "failed-token",
          message: "Failed to authenticate token.",
        };
      }
    } catch (err) {
      result = {
        status: "error",
        message: err.toString(),
      };
    }
    return result;
  }
  //Add comment service
  async addComment(auth, data) {
    let result;

    try {
      if (auth) {
        const { date, imageId, userEmail, commentText } = data;
        const token = auth.split(" ")[1];

        await verifyToken(token).then(async (verify) => {
          if (verify.status == "ok") {
            var query_db = [
              "INSERT INTO app_imageComments(create_time,update_time,image_id,comment_text,user_email)",
              `VALUES('${date}','${date}','${imageId}','${commentText}','${userEmail}')`,
            ].join(" ");
            await query(query_db)
              .then(async (rows) => {
                var query_count = `SELECT * FROM app_commentCount WHERE image_id='${imageId}'`;
                await query(query_count)
                  .then(async (count) => {
                    if (count.length > 0) {
                      var sum = count[0].count_comments + 1;
                      var query_set = [
                        "UPDATE app_commentCount",
                        `SET count_comments='${sum}'`,
                        `WHERE image_id='${imageId}'`,
                      ].join(" ");
                      await query(query_set);
                    } else {
                      var query_add = [
                        "INSERT INTO app_commentCount(create_time,update_time,image_id,count_comments)",
                        `VALUES('${date}','${date}','${imageId}','${1}')`,
                      ].join(" ");
                      await query(query_add);
                    }
                  })
                  .catch((err) => {
                    result = {
                      status: "error",
                      message: err.toString(),
                    };
                  });
                result = {
                  status: "success",
                  message: "added",
                };
              })
              .catch((err) => {
                result = {
                  status: "error",
                  message: err.toString(),
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
    } catch (err) {
      result = {
        status: "error",
        message: err.toString(),
      };
    }
    return result;
  }

  async deleteComment(auth, id) {
    let result;

    try {
      if (auth) {
        const token = auth.split(" ")[1];
        await verifyToken(token).then(async (verify) => {
          if (verify.status == "ok") {
            var query_db = `DELETE FROM app_imageComments WHERE id=${id}`;
            await query(query_db)
              .then(async (rows) => {
                result = {
                  status: "success",
                  message: "comment deleted",
                };
              })
              .catch((err) => {
                result = {
                  status: "error",
                  message: err.toString(),
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
    } catch (err) {
      result = {
        status: "error",
        message: err.toString(),
      };
    }
    return result;
  }
}

export default new CommentService();
