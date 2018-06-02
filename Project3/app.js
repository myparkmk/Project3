var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');

var list = require('./routes/list');
var service = require('./routes/service');
var mypage = require('./routes/mypage');
var shop = require('./routes/shop');
var order = require('./routes/order');
var signup = require('./routes/signup');
var login = require('./routes/login');
var ceo = require('./routes/ceo');
var ceo_sales = require('./routes/ceo_sales');
var ceo_review = require('./routes/ceo_review');
var ceo_signup = require('./routes/ceo_signup');
var ceo_service = require('./routes/ceo_service');
var ceo_login = require('./routes/ceo_login');
var admin = require('./routes/admin');
var admin_ceo = require('./routes/admin_ceo');
var service_board = require('./routes/service_board');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use('/', routes);
app.use('/users', users);

app.use('/list', list);
app.use('/service',service);
app.use('/mypage',mypage);
app.use('/signup', signup);
app.use('/login', login);
app.use('/shop', shop);
app.use('/order', order);
app.use('/ceo', ceo);
app.use('/ceo_sales', ceo_sales);
app.use('/ceo_review', ceo_review);
app.use('/ceo_signup', ceo_signup);
app.use('/ceo_service', ceo_service);
app.use('/ceo_login', ceo_login);
app.use('/service_board',service_board);
app.use('/admin', admin);
app.use('/admin_ceo', admin_ceo);


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


module.exports = app;
