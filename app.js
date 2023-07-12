var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const http = require('http');

var indexRouter = require("./app/routers/index");
var usersRouter = require("./app/routers/users");

var app = express();
const port = 8080;

// const server = http.createServer((req, res) => {
//   // Your server logic goes here
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello, World!');
// });

// server.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

app.use(function(req, res, next) { // allow cross-origin requests
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// view engine setup
app.set("views", path.join("/home/dell/myapp/app/", "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
