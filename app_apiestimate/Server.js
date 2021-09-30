import fs from 'fs';
//import {promises as fs} from "fs";
import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import multer from 'multer';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cryptoRandomString from 'crypto-random-string';
import recursiveCopy from 'recursive-copy';
import winston from 'winston';

//const nodemailer = require("nodemailer");
import nodeoutlook from 'nodejs-nodemailer-outlook';
import { dbConfig, emailAuth } from './src/utils/Auth';
import logger from './src/utils/loggers';
import apiRouter from './src/app';

const app = express();
const server = require("http").createServer(app);

app.set("port", process.env.PORT || 3001);

app.set("trust proxy", 1);
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'))

app.use('/api', apiRouter);
app.use(logger.sendResponse);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = `public/images/${req.params.id}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

const accessTokenSecret = 'RoofAPI';

app.put('/api/user/email-verification/:token', (req, res) => {
    var token = req.params.token;
    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
            res.json({
                'status': 'failed',
                'message': 'Verify code is unvalid.'
            });
        } else {
            const dbConnect = mysql.createConnection(dbConfig);
            dbConnect.connect(function (err) { if (err) throw err; });
            var updatedAt = new Date().toISOString();
            var query = [
                'UPDATE app_users',
                `SET email_verified='Yes',updatedAt='${updatedAt}'`,
                `WHERE id=${user.id}`
            ].join(' ');
            dbConnect.query(query, function (err, results, fields) {
                if (err) throw err;
                res.json({
                    'status': 'success',
                    'results': results
                });
            });
        }
    });
});

app.post('/api/user/forgot-password', (req, res) => {
    const email = req.body.email;
    const dbConnect = mysql.createConnection(dbConfig);
    dbConnect.connect(function (err) { if (err) throw err; });
    // check email
    var query = `SELECT * FROM app_users WHERE email='${email}'`;
    dbConnect.query(query, function (err, users, fields) {
        if (err) throw err;
        if (users.length > 0) {
            var user = users[0];
            var newPassword = cryptoRandomString({ length: 10, type: 'base64' });
            const hashedPassword = bcrypt.hashSync(newPassword, 8);
            var updatedAt = new Date().toISOString();
            query = [
                'UPDATE app_users',
                `SET password='${hashedPassword}',updatedAt='${updatedAt}'`,
                `WHERE id=${user.id}`
            ].join(' ');
            dbConnect.query(query, function (err, results, fields) {
                if (err) throw err;
                nodeoutlook.sendEmail({
                    auth: {
                        user: emailAuth.email,
                        pass: emailAuth.password
                    },
                    from: `Xscope <${emailAuth.email}>`,
                    to: user.email,
                    subject: 'Welcome to Xscope',
                    html: [
                        `<p>Hi, ${user.name}</p>`,
                        `<p>We send new password for your login.`,
                        `<p>${newPassword}</p>`
                    ].join(''),
                    onError: (e) => console.log({ message: e }),
                    onSuccess: (i) => console.log({ message: `email sent to ${user.name}:${user.email}` })
                });
                res.json({
                    'status': 'success',
                    'results': 'We sent new password to your email.'
                });
            });
        } else {
            res.json({
                status: 'failed-request',
                message: 'Your email is wrong.'
            });
        }
    });
});

app.post('/api/user/login', (req, res) => {
    console.log(req.body);
    const { email, password, remember } = req.body;
    const dbConnect = mysql.createConnection(dbConfig);
    dbConnect.connect(function (err) { if (err) throw err; });
    // check email
    var query = `SELECT * FROM app_users WHERE email='${email}'`;
    dbConnect.query(query, function (err, users, fields) {
        if (err) throw err;
        if (users.length > 0) {
            var user = users[0];
            // check password
            bcrypt.compare(password, user.password, (err, data) => {
                
                if (err) throw err;
                if (data) {
                    // check email verification
                    if (user.email_verified === 'Yes') {
                        var expire = remember ? '3d' : '2h';
                        var token = jwt.sign({ id: user.id, name: user.name, email: user.email }, accessTokenSecret, {
                            expiresIn: expire // 10 '10s', '10h', '10d'
                        });
                        res.json({
                            status: 'success',
                            token: token,
                            email: user.email,
                            name: user.name,
                            photo: user.profile_photo
                        });
                    } else {
                        // send mail
                        var token = jwt.sign({ id: user.id, name: user.name, email: user.email }, accessTokenSecret, { expiresIn: '1h' });
                        nodeoutlook.sendEmail({
                            auth: {
                                user: emailAuth.email,
                                pass: emailAuth.password
                            },
                            from: `Xscope <${emailAuth.email}>`,
                            to: email,
                            subject: 'Welcome to Xscope',
                            html: [
                                `<p>Hi, ${user.name} and welcome to Xscope</p>`,
                                `<p>Please verify to complete your sign-up.</p>`,
                                `<p>Verify code (expired in an hour):</p>`,
                                `<p>${token}</p>`
                            ].join(''),
                            onError: (e) => console.log({ message: e }),
                            onSuccess: (i) => console.log({ message: `email sent to ${user.name}:${user.email}` })
                        });
                        res.json({
                            status: 'failed-email-verification',
                            message: 'We sent message to your email. Please verify your email.'
                        });
                    }
                } else {
                    res.json({
                        status: 'failed-request',
                        message: 'Your password is wrong.'
                    });
                }
            });
        } else {
            res.json({
                status: 'failed-request',
                message: 'Your email is wrong.'
            });
        }
    });
});

app.get('/api/user/info', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                res.json({
                    'status': 'failed-token',
                    'message': 'Failed to authenticate token.'
                });
            } else {
                res.json({
                    'status': 'success',
                    'results': user
                });
            }
        });
    } else {
        res.json({
            'status': 'failed-token',
            'message': 'Failed to authenticate token.'
        });
    }
});

app.get('/api/user/get/profile', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                res.json({
                    'status': 'failed-token',
                    'message': 'Failed to authenticate token.'
                });
            } else {
                const dbConnect = mysql.createConnection(dbConfig);
                dbConnect.connect(function (err) { if (err) throw err; });
                var query = `SELECT id,name,email,phone,address,profile_photo FROM app_users WHERE id='${user.id}'`;
                dbConnect.query(query, function (err, results, fields) {
                    if (err) throw err;
                    res.json({
                        'status': 'success',
                        'results': results
                    });
                });
            }
        });
    } else {
        res.json({
            'status': 'failed-token',
            'message': 'Failed to authenticate token.'
        });
    }
});

app.put('/api/user/change/profile', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                res.json({
                    'status': 'failed-token',
                    'message': 'Failed to authenticate token.'
                });
            } else {
                const { name, email, phone, address } = req.body;
                const dbConnect = mysql.createConnection(dbConfig);
                dbConnect.connect(function (err) { if (err) throw err; });
                var updatedAt = new Date().toISOString();
                var query = `SELECT * FROM app_users WHERE email='${email}' AND id<>${user.id}`;
                dbConnect.query(query, function (err, users, fields) {
                    if (err) throw err;
                    if (users.length > 0) {
                        res.json({
                            'status': 'failed-request',
                            'message': 'Email is duplicated'
                        });
                    } else {
                        query = [
                            'UPDATE app_users',
                            `SET name='${name}',email='${email}',phone='${phone}',address='${address}',updatedAt='${updatedAt}'`,
                            `WHERE id=${user.id}`
                        ].join(' ');
                        dbConnect.query(query, function (err, results, fields) {
                            if (err) throw err;
                            res.json({
                                'status': 'success',
                                'results': results
                            });
                        });
                    }
                });
            }
        });
    } else {
        res.json({
            'status': 'failed-token',
            'message': 'Failed to authenticate token.'
        });
    }
});

app.put('/api/user/change/password', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                res.json({
                    'status': 'failed-token',
                    'message': 'Failed to authenticate token.'
                });
            } else {
                const dbConnect = mysql.createConnection(dbConfig);
                dbConnect.connect(function (err) { if (err) throw err; });
                var oldPassword = req.body.oldPassword;
                var hashedPassword = bcrypt.hashSync(req.body.newPassword, 8);
                var updatedAt = new Date().toISOString();
                var query = `SELECT * FROM app_users WHERE id=${user.id}`;
                dbConnect.query(query, function (err, users, fields) {
                    if (err) throw err;
                    bcrypt.compare(oldPassword, users[0].password, (err, data) => {
                        if (err) throw err;
                        if (data) {
                            query = [
                                'UPDATE app_users',
                                `SET password='${hashedPassword}',updatedAt='${updatedAt}'`,
                                `WHERE id=${user.id}`
                            ].join(' ');
                            dbConnect.query(query, function (err, results, fields) {
                                if (err) throw err;
                                res.json({
                                    'status': 'success',
                                    'results': results
                                });
                            });
                        } else {
                            res.json({
                                status: 'failed-request',
                                message: 'Your old password is wrong.'
                            });
                        }
                    });
                });
            }
        });
    } else {
        res.json({
            'status': 'failed-token',
            'message': 'Failed to authenticate token.'
        });
    }
});

app.delete('/api/user/delete', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                res.json({
                    'status': 'failed-token',
                    'message': 'Failed to authenticate token.'
                });
            } else {
                const dbConnect = mysql.createConnection(dbConfig);
                dbConnect.connect(function (err) { if (err) throw err; });
                var currentPassword = req.body.currentPassword;
                var query = `SELECT * FROM app_users WHERE id=${user.id}`;
                dbConnect.query(query, function (err, users, fields) {
                    if (err) throw err;
                    bcrypt.compare(currentPassword, users[0].password, (err, data) => {
                        if (err) throw err;
                        if (data) {
                            query = `SELECT id FROM app_measurements WHERE user_id=${user.id}`;
                            dbConnect.query(query, function (err, measurements, fields) {
                                if (err) throw err;
                                // delete image directories
                                measurements.forEach(measurement => {
                                    var mID = measurement.id;
                                    var dirPath = `public/images/${mID}`;
                                    fs.rmSync(dirPath, { recursive: true, force: true });
                                });
                                query = `DELETE FROM app_users WHERE id=${user.id}`;
                                dbConnect.query(query, function (err, results, fields) {
                                    if (err) throw err;
                                    res.json({
                                        'status': 'success',
                                        'results': results
                                    });
                                });
                            });
                        } else {
                            res.json({
                                status: 'failed-request',
                                message: 'Your current password is wrong.'
                            });
                        }
                    });
                });
            }
        });
    } else {
        res.json({
            'status': 'failed-token',
            'message': 'Failed to authenticate token.'
        });
    }
});

app.get('/api/measurements', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                res.json({
                    'status': 'failed-token',
                    'message': 'Failed to authenticate token.'
                });
            } else {
                const dbConnect = mysql.createConnection(dbConfig);
                dbConnect.connect(function (err) { if (err) throw err; });
                var query = `SELECT id,project_name,updatedAt FROM app_measurements WHERE user_id=${user.id} ORDER BY updatedAt DESC`;
                dbConnect.query(query, function (err, results, fields) {
                    if (err) throw err;
                    res.json({
                        'status': 'success',
                        'results': results
                    });
                });
            }
        });
    } else {
        res.json({
            'status': 'failed-token',
            'message': 'Failed to authenticate token.'
        });
    }
});

app.get('/api/measurement/:id', (req, res) => {
    var mID = req.params.id;
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                res.json({
                    'status': 'failed-token',
                    'message': 'Failed to authenticate token.'
                });
            } else {
                const dbConnect = mysql.createConnection(dbConfig);
                dbConnect.connect(function (err) { if (err) throw err; });
                var query = `SELECT * FROM app_measurements WHERE user_id=${user.id} AND id=${mID}`;
                dbConnect.query(query, function (err, results, fields) {
                    if (err) throw err;
                    res.json({
                        'status': 'success',
                        'results': results
                    });
                });
            }
        });
    } else {
        res.json({
            'status': 'failed-token',
            'message': 'Failed to authenticate token.'
        });
    }
});

app.post('/api/measurement/add', upload.none(), (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                res.json({
                    'status': 'failed-token',
                    'message': 'Failed to authenticate token.'
                });
            } else {
                const { location, zoom, bearing, geodata, options } = req.body;
                var optionsJson = JSON.parse(options);
                var project_name = optionsJson['basicInformation']['projectName'];
                const dbConnect = mysql.createConnection(dbConfig);
                dbConnect.connect(function (err) { if (err) throw err; });
                var createdAt = new Date().toISOString();
                var updatedAt = createdAt;
                var query = [
                    'INSERT INTO app_measurements(user_id,project_name,location,zoom,bearing,geodata,options,createdAt,updatedAt)',
                    `VALUES(${user.id},'${project_name}','${location}',${zoom},${bearing},'${geodata}','${options}','${createdAt}','${updatedAt}')`
                ].join(' ');

                dbConnect.query(query, function (err, results, fields) {
                    if (err) throw err;
                    res.json({
                        'status': 'success',
                        'results': results
                    });
                });
            }
        });
    } else {
        res.json({
            'status': 'failed-token',
            'message': 'Failed to authenticate token.'
        });
    }
});

app.put('/api/measurement/update/:id', upload.array('images'), (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                res.json({
                    'status': 'failed-token',
                    'message': 'Failed to authenticate token.'
                });
            } else {
                const mID = req.params.id;
                const { location, zoom, bearing, geodata, options } = req.body;
                var optionsJson = JSON.parse(options);
                var project_name = optionsJson['basicInformation']['projectName'];
                const dbConnect = mysql.createConnection(dbConfig);
                dbConnect.connect(function (err) { if (err) throw err; });
                var updatedAt = new Date().toISOString();
                var query = [
                    'UPDATE app_measurements',
                    `SET project_name='${project_name}',location='${location}',zoom=${zoom},bearing=${bearing}`,
                    `,geodata='${geodata}',options='${options}',updatedAt='${updatedAt}'`,
                    `WHERE user_id=${user.id} AND id=${mID}`
                ].join(' ');
                dbConnect.query(query, function (err, results, fields) {
                    if (err) throw err;
                    // delete image files
                    var dirPath = `public/images/${mID}`;
                    if (fs.existsSync(dirPath)) {
                        const files = fs.readdirSync(dirPath);
                        var exsistFiles = [];
                        exsistFiles.push('thumb.jpg');
                        optionsJson['generalConditions'].images.forEach(filename => exsistFiles.push(filename));
                        optionsJson['roofDrainage']['drainageItems'].forEach(drainageItem => {
                            drainageItem.items.forEach(item => {
                                item.images.forEach(filename => exsistFiles.push(filename));
                            });
                        });
                        optionsJson['wallDetails']['wallProperties'].forEach(item => {
                            item.images.forEach(filename => exsistFiles.push(filename));
                        });
                        optionsJson['roofDetails'].forEach(item => {
                            item.images.forEach(filename => exsistFiles.push(filename));
                        });
                        exsistFiles.forEach(filename => {
                            var removeIndex = files.indexOf(filename);
                            if (removeIndex > -1) {
                                delete files[removeIndex];
                            }
                        });
                        files.forEach(filename => {
                            if (fs.existsSync(dirPath + '/' + filename)) {
                                fs.unlinkSync(dirPath + "/" + filename);
                            }
                        });
                    }
                    res.json({
                        'status': 'success',
                        'results': results
                    });
                });
            }
        });
    } else {
        res.json({
            'status': 'failed-token',
            'message': 'Failed to authenticate token.'
        });
    }
});

app.put('/api/measurement/project/rename/:id', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                res.json({
                    'status': 'failed-token',
                    'message': 'Failed to authenticate token.'
                });
            } else {
                const mID = req.params.id;
                const { project_name } = req.body;
                const dbConnect = mysql.createConnection(dbConfig);
                dbConnect.connect(function (err) { if (err) throw err; });
                var updatedAt = new Date().toISOString();
                var query = [
                    'UPDATE app_measurements',
                    `SET project_name='${project_name}',updatedAt='${updatedAt}'`,
                    `WHERE user_id=${user.id} AND id=${mID}`
                ].join(' ');
                dbConnect.query(query, function (err, results, fields) {
                    if (err) throw err;
                    results['updatedAt'] = updatedAt;
                    res.json({
                        'status': 'success',
                        'results': results
                    });
                });
            }
        });
    } else {
        res.json({
            'status': 'failed-token',
            'message': 'Failed to authenticate token.'
        });
    }
});

app.delete('/api/measurement/delete/:id', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                res.json({
                    'status': 'failed-token',
                    'message': 'Failed to authenticate token.'
                });
            } else {
                const dbConnect = mysql.createConnection(dbConfig);
                dbConnect.connect(function (err) { if (err) throw err; });
                var mID = req.params.id;
                var query = `DELETE FROM app_measurements WHERE user_id=${user.id} AND id=${mID}`;
                dbConnect.query(query, function (err, results, fields) {
                    if (err) throw err;
                    // delete image directory
                    var dirPath = `public/images/${mID}`;
                    if (fs.existsSync(dirPath)) {
                        fs.rmSync(dirPath, { recursive: true, force: true });
                    }
                    res.json({
                        'status': 'success',
                        'results': results
                    });
                });
            }
        });
    } else {
        res.json({
            'status': 'failed-token',
            'message': 'Failed to authenticate token.'
        });
    }
});

app.post('/api/measurement/duplicate/:id', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                res.json({
                    'status': 'failed-token',
                    'message': 'Failed to authenticate token.'
                });
            } else {
                const dbConnect = mysql.createConnection(dbConfig);
                dbConnect.connect(function (err) { if (err) throw err; });
                var mID = req.params.id;
                var createdAt = new Date().toISOString();
                var query = [
                    'INSERT INTO app_measurements',
                    `(user_id,project_name,location,zoom,bearing,geodata,options,createdAt,updatedAt)`,
                    `SELECT user_id,project_name,location,zoom,bearing,geodata,options,'${createdAt}','${createdAt}'`,
                    `FROM app_measurements`,
                    `WHERE user_id=${user.id} AND id=${mID}`
                ].join(' ');

                dbConnect.query(query, function (err, insertResults, fields) {
                    if (err) throw err;
                    var newID = insertResults['insertId'];
                    recursiveCopy(`public/images/${mID}`, `public/images/${newID}`, function (error, copyResults) {
                        if (error) {
                            console.error('Copy failed: ' + error);
                        } else {
                            //console.info('Copied ' + copyResults.length + ' files');
                            insertResults['updatedAt'] = createdAt;
                            res.json({
                                'status': 'success',
                                'results': insertResults
                            });
                        }
                    });
                });
            }
        });
    } else {
        res.json({
            'status': 'failed-token',
            'message': 'Failed to authenticate token.'
        });
    }
});

// start the server
server.listen(app.get("port"), () => {
    winston.info(`API running at http://localhost:${app.get("port")}`);
});