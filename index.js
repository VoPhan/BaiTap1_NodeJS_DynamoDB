require('dotenv').config();
const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require("body-parser");

const indexRoute = require('./route/index.route');

const app = express();
const port = 3000;

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(port, () => {
  console.log('listen port : ' + port);
})

app.use('/', indexRoute);
