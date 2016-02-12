"use strict";
const express = require('express');
const app = express();  // or const app = require('express')();
const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://localhost:27017/node-webserver';
const path = require('path');
const sassMiddleware = require('node-sass-middleware');

const routes = require('./routes/routes');


let PORT = process.env.PORT || 3000;
app.set('view engine', 'jade');
app.locals.title = `Mat's Super Cool App`;

app.use(express.static(path.join(__dirname, 'public')));
app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
}));

app.use(routes);

mongoose.connect(MONGO_URL);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {

  app.listen(PORT, () => {
    console.log(`Node.js server started. Listening on port ${PORT}`);
  });

});
