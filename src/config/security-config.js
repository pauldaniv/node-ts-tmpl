'use strict';

const app = require('express')();

const {appConf} = require('./app-config');
const {theMiddleware, memoryStore} = require('./middleware-config');
const {getUserDetails} = require('../services/user.service');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors());

// app.use(session({
//   secret: appConf.sessionSecret,
//   resave: false,
//   saveUninitialized: true,
//   store: memoryStore,
//   secure: true
// }));

// app.use(cookieParser());

// app.use(csurf({
//   cookie: {
//     key: '_csrf',
//     path: '/',
//     httpOnly: true,
//     secure: true,
//     maxAge: 3600 // 1-hour
//   }
// }));

function csurf() {
  return (req, res, next) => next();
}

app.use(theMiddleware);

app.use(async (req, res, next) => {
  if (req.jwttoken) {
    try {
      req.userDetails = await getUserDetails(req);
    } catch (e) {
      next(e);
    }
  }
  next();
});

module.exports = app;
