const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const toastr = require('express-toastr');
const apicache = require('apicache');
const i18n = require('i18n');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const cache = apicache.middleware;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// Internationalization setup
i18n.configure({
  locales: ['en', 'fr'], // Supported languages
  directory: path.join(__dirname, 'locales'), // Path to the locales directory
  defaultLocale: 'en', // Default language
  queryParameter: 'lang', // Query parameter to switch language
  autoReload: true, // Auto reload translation files
  updateFiles: false // Disable writing new locale information
});

app.use(i18n.init);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));
app.use(flash());
app.use(toastr());

app.use((req, res, next) => {
  let locale = req.query.lang || req.cookies.lang || 'en';
  i18n.setLocale(locale);
  next();
});
// Toastr messages setup
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
});

 

// Cache middleware setup (apply globally)
// Uncomment the line below to cache all routes for 5 minutes by default
// app.use(cache('5 minutes'));

// Define your routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
