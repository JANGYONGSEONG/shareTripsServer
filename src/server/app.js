const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users',require('./api/users/index'));
app.use('/reports',require('./api/reports/index'));
//app.use('/recommendations',require('./api/recommendations/index'));

module.exports = {
  app: app,
  bodyParser: bodyParser
}
