"use strict";
const express = require('express');
const app = express();  // or const app = require('express')();
const mongoose = require('mongoose');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');

const PORT = process.env.PORT || 3000; // eslint-disable-line no-magic-numbers
const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
const MONGODB_PORT = process.env.MONGODB_PORT || 27017; // eslint-disable-line no-magic-numbers
const MONGODB_USER = process.env.MONGODB_USER || '';
const MONGODB_PASS = process.env.MONGODB_PASS || '';
const MONGODB_NAME = process.env.MONGODB_NAME || 'node-webserver';
const MONGODB_URL_PREFIX = MONGODB_USER
	? `${MONGODB_USER}:${MONGODB_PASS}@`
	: '';

const MONGO_URL = `mongodb://${MONGODB_URL_PREFIX}${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_NAME}`;

const routes = require('./routes/');

app.set('view engine', 'jade');
app.locals.title = `Mat's Super Cool App`;

app.use(express.static(path.join(__dirname, 'public')));
app.use(sassMiddleware({
  /* Options */
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'compressed'
}));

app.use(routes);

mongoose.connect(MONGO_URL);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Node.js server started. Listening on port ${PORT}`);
  });
});
