import bcrypt from "bcryptjs";
import cryptoRandomString from "crypto-random-string";
import nodeoutlook from "nodejs-nodemailer-outlook";
import { query } from "../utils/authDB";
import { emailAuth } from "../utils/Auth";
import { signToken } from "../utils/token";

class UserService {
  async addUser(data) {
    let result;

    try {
      const { name, email, password, phone, address } = data;
      const hashedPassword = bcrypt.hashSync(password, 8);
      var query_exists = `SELECT * FROM app_users WHERE email='${email}'`;
      await query(query_exists)
        .then(async (rows) => {
          if (rows.length > 0) {
            result = {
              status: "failed-request",
              message: "Email is duplicated.",
            };
          } else {
            var createdAt = new Date().toISOString();
            var updatedAt = createdAt;
            var add_data = [
              "INSERT INTO app_users(name,email,password,phone,address,role,email_verified,createdAt,updatedAt)",
              `VALUES('${name}','${email}','${hashedPassword}','${phone}','${address}','Subscriber','No','${createdAt}','${updatedAt}')`,
            ].join(" ");
            await query(add_data)
              .then(async (results) => {
                const token = await signToken({
                  id: results["insertId"],
                  name: name,
                  email: email,
                });
                nodeoutlook.sendEmail({
                  auth: {
                    user: emailAuth.email,
                    pass: emailAuth.password,
                  },
                  from: `Xscope <${emailAuth.email}>`,
                  to: email,
                  subject: "Welcome to Xscope",
                  html: [
                    `<p>Hi, ${name} and welcome to Xscope.</p>`,
                    `<p>Please verify to complete your sign-up.</p>`,
                    `<p>Verify code (expired in an hour):</p>`,
                    `<p>${token}</p>`,
                  ].join(""),
                  onError: (e) => console.log({ message: e }),
                  onSuccess: (i) =>
                    console.log({ message: `email sent to ${name}:${email}` }),
                });
                result = {
                  status: "success",
                  results: results,
                };
              })
              .catch((err) => {
                result = {
                  status: "error",
                  message: "Failed to add user",
                  error: err,
                };
              });
          }
        })
        .catch((err) => {
          result = {
            status: "error",
            message: "Failed to verify user",
            error: err,
          };
        });
    } catch (err) {
      result = {
        status: "error",
        message: err.toString(),
      };
    }
    return result;
  }
}

export default new UserService();
