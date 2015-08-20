var express = require('express');
var app = express();
var router = express.Router();
var port = process.env.PORT || 3000;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('passport');
var flash = require('express-flash');
var SMTPserver = require('smtp-server');

var db = require('./model/db');
// var cards = require('./model/card');
// var groups = require('./model/group');

var routes = require('./routes/index');
var cards = require('./routes/cards');
var decks = require('./routes/decks');
var groups = require('./routes/groups');
var sessions = require('./routes/sessions');
var experiments = require('./routes/experiments');
var projects = require('./routes/projects');
var users = require('./routes/users');

// var server = new SMTPserver({
//   name : 'uxsmtp',
// });

// server.listen(465);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport configuration
app.use(session({
  secret: 'mySecretKey',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(router);

// pass passport module for configuration
require('./config/passport')(passport);

// route setup
app.use('/', routes);
app.use('/cards', cards);
app.use('/decks', decks);
app.use('/groups', groups);
app.use('/sessions', sessions);
app.use('/experiments', experiments);
app.use('/projects', projects);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//launch
app.listen(port);

module.exports = app;