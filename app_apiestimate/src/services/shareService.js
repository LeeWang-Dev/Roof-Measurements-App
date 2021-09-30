import { query } from "../utils/authDB";
import { verifyToken } from "../utils/token";
import { emailAuth } from "../utils/Auth";
import { transporter } from "../utils/config";

class ShareService {
  async getShared(auth, id) {
    let result;

    try {
      if (auth) {
        const token = auth.split(" ")[1];
        await verifyToken(token).then(async (verify) => {
          if (verify.status == "ok") {
            var query_db = `SELECT id, user_email as email, measurements_id as measurementId, user_owner as owner FROM app_shared WHERE measurements_id=${id}`;
            await query(query_db)
              .then(async (rows) => {
                result = {
                  status: "success",
                  sharedUsers: rows,
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
  async addUpdateShared(auth, data) {
    let result;
    let shared = [];

    try {
      if (auth) {
        shared = data.sharedUsers;
        const token = auth.split(" ")[1];
        const date = new Date().toISOString();

        await verifyToken(token)
          .then(async (verify) => {
            if (verify.status == "ok") {
              await Promise.all(
                shared.map(async (resShared) => {
                  var query_verify = `SELECT * FROM app_shared WHERE user_email='${resShared.email}' and measurements_id='${data.measurementsId}'`;
                  await query(query_verify)
                    .then(async (rowsVerify) => {
                      if (rowsVerify.length > 0) {
                        var query_update = [
                          "UPDATE app_shared",
                          `SET user_owner='${resShared.owner}'`,
                          `, update_time='${date}'`,
                          `WHERE user_email='${resShared.email}'`,
                        ].join(" ");
                        await query(query_update)
                          .then((resUpdate) => {
                            console.log(data);

                            let message = {
                              from: data.email,
                              to: resShared.email,
                              subject: "Invite subject",
                              text: "Invite",
                              html: [
                                `<p>Hi, ${data.name} has sent you an invitation.</p>`,
                                `<p> Click <a href=${
                                  "https://app.x-scope.net/Edit/Project/" +
                                  data.measurementsId
                                }>here </a> </p>'`,
                              ].join(""),
                            };
                            transporter.sendMail(message, (err, info) => {
                              if (err) {
                                console.log("Error occurred. " + err.message);
                                return process.exit(1);
                              }

                              console.log("Message sent: %s", info.messageId);
                              // Preview only available when sending through an Ethereal account
                              console.log(
                                "Preview URL: %s",
                                nodemailer.getTestMessageUrl(info)
                              );
                            });
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      } else {
                        var query_add = [
                          "INSERT INTO app_shared(create_time,update_time,user_email,measurements_id,user_owner)",
                          `VALUES('${date}','${date}','${resShared.email}','${data.measurementsId}','${resShared.owner}')`,
                        ].join(" ");
                        await query(query_add)
                          .then(async (rows) => {
                            let message = {
                              from: data.email,
                              to: resShared.email,
                              subject: "Invite subject",
                              text: "Invite",
                              html: [
                                `<p>Hi, ${data.name} has sent you an invitation.</p>`,
                                `<p> Click <a href=${
                                  "https://app.x-scope.net/Edit/Project/" +
                                  data.measurementsId
                                }>here </a> </p>'`,
                              ].join(""),
                            };

                            transporter.sendMail(message, (err, info) => {
                              if (err) {
                                console.log("Error occurred. " + err.message);
                                return process.exit(1);
                              }
                              console.log("Message sent: %s", info.messageId);
                              // Preview only available when sending through an Ethereal account
                              console.log(
                                "Preview URL: %s",
                                nodemailer.getTestMessageUrl(info)
                              );
                            });
                            console.log(rows);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      result = {
                        status: "error",
                        message: err.toString(),
                      };
                    });
                })
              )
                .finally(() => {
                  result = {
                    status: "success",
                    shared: "Shared with users",
                  };
                })
                .catch(() => {
                  result = {
                    status: "error",
                    shared: "Error shared with users",
                  };
                });
            } else {
              result = {
                status: "failed-token",
                message: "Failed to authenticate token.",
              };
            }
          })
          .catch((err) => {
            console.log(err);
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
      console.log(err);
      result = {
        status: "error",
        message: err.toString(),
      };
    }
    return result;
  }
  async deleteShared(auth, id) {
    let result;

    try {
      if (auth) {
        const token = auth.split(" ")[1];
        await verifyToken(token).then(async (verify) => {
          if (verify.status == "ok") {
            var query_db = `DELETE FROM app_shared WHERE id=${id}`;
            await query(query_db)
              .then(async (rows) => {
                result = {
                  status: "success",
                  message: "shared deleted",
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

export default new ShareService();
