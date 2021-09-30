import nodemailer from "nodemailer";

export let transporter = nodemailer.createTransport({
  host: "smtp.office365.com", // Office 365 server
  port: 587, // secure SMTP
  //secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
  auth: {
    user: "xscopeappestimate@outlook.com",
    pass: "Chanch1s__",
  },
});
