var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var taskRouter = require('./routes/tasks');
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');
var user = require('./models/user');

var app = express();
app.all('*', (req, res, next) => {
	if(req.secure){
		return next();
	}
	else{
		res.redirect(307, 'https://'+req.hostname+':'+app.get('secport')+req.url);
	}
})

const url = 'mongodb://Sakshi30:Dines2h@ds131323.mlab.com:31323/todolist_sakshi';


mongoose.connect(url, {useNewUrlParser: true});


// view engine setup
app.set('view engine', 'html');
app.set('views', 'dist');

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', taskRouter);




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
