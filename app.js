var createError = require('http-errors');
var express = require('express');
var path = require('path');
var flash = require('express-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var condamnationRouter = require('./routes/condamnation');
var reduireRouter = require('./routes/reduire_peine');
var libererRouter = require('./routes/liberer_definitivement');
var preventiveRouter = require('./routes/preventive');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use(session({
  cookie: { maxAge: 60000 },
  store: new session.MemoryStore,
  saveUninitialized: true,
  resave: 'true',
  secret: 'secret'
}));

app.use(flash());

app.use('/', indexRouter);
app.use('/condamnation', condamnationRouter);
app.use('/reduire', reduireRouter);
app.use('/liberer', libererRouter);
app.use('/preventive', preventiveRouter);

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
