const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require("compression");
const helmet = require('helmet')
const RateLimit = require('express-rate-limit')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const coolRouter = require('./routes/cool')
const catalogRouter = require('./routes/catalog')

const app = express();
app.use(helmet.contentSecurityPolicy({
  directives:{
    "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
  }
}))
const limiter = RateLimit({
  windowMs:1*60*1000,
  max:20,
})
app.use(limiter)
const mongoose = require('mongoose')
mongoose.set("strictQuery",false)
const dev_db_url = "mongodb+srv://shriharshdev:lLG3bCti3nWk7adS@cluster0.ynhzz9a.mongodb.net/local_library?retryWrites=true&w=majority"
const mongoDB = process.env.MONGODB_URI || dev_db_url
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/users/cool',coolRouter)
app.use('/catalog',catalogRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
