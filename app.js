var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
//express-validation is a middleware that validates the body, params, query, headers and cookies
//of a request and returns a response with errors; if any of the configured validation rules fail.
var expressValidator = require("express-validator");

var mongoose = require("mongoose");
var passport = require("passport");
var session = require("express-session");

// This one added
const flash = require("connect-flash");

require("./passport");
var config = require("./config");

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auth");
var taskRouter = require("./routes/task");

//connect the database
mongoose.connect(config.dbConnstring);
global.User = require("./models/user");
global.Task = require("./models/task");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(
  session({
    secret: config.sessionKey,
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));
app.use(expressValidator());

// if user is authenticated we create session variable name and we pass request user into that one.
//within our application we can use locals.user
app.use(function(req, res, next) {
  if (req.isAuthenticated()) {
    //console.log("User: ", req.user);
    res.locals.user = req.user;
  }
  next();
});

//This one added
app.use(flash());
app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/", taskRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
