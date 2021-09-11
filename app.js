const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const security = require('./util/security');
const flash = require("connect-flash");

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/admin/users');
const userRouter = require('./routes/admin/user');
const postsRouter = require('./routes/admin/posts');
const postRouter = require('./routes/admin/post');
const filesRouter = require('./routes/admin/files');
const fileRouter = require('./routes/admin/file');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//セッションの有効化
const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  name: "sid",
  cookie: {
    maxAge: 3 * 24 * 60 * 1000,
    secure: false
  }
}));

//認証の初期化
app.use(...security.initialize());

app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin/users', usersRouter);
app.use('/admin/user', userRouter);
app.use('/admin/posts', postsRouter);
app.use('/admin/post', postRouter);
app.use('/admin/files', filesRouter);
app.use('/admin/file', fileRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
