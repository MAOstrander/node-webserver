"use strict";
const express = require('express');
const app = express();
// or const app = require('express')();

app.set('view engine', 'jade');
let PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Super Cool App',
    date: new Date
  });
});

app.get('/hello', (req, res) => {
  res.writeHead(200, {
    'Content-type': 'text/html'
  });
  console.log('THOSE PARAMS!', req.query);
  var whodis = 'World';
  if (req.query.name) {
    whodis = req.query.name;
  }

  res.write('<h1>Yarp</h1>');
  const msg = `<h1>Hello ${whodis}!</h1>`;

  msg.split('').forEach((char, i) => {
    setTimeout(() => {
      res.write(char);
    }, 1000*i);
  });

  setTimeout(() => {
    res.end('<h3>Goodbye</h3>');
  }, 20000);

});

app.get('/random/:min/:max', (req, res) => {
  const mymin = req.params.min;
  const mymax = req.params.max;
  res.status(200).send((Math.floor(Math.random()*(mymax-mymin+1)+mymin)).toString());
});

app.get('/random', (req, res) => {
  res.status(200).send(Math.random().toString());
});

app.get('/cal/:year/:month', (req, res) => {
  const monthModule = require('node-cal/lib/month').joinOutput;
  const year = req.params.year;
  const month = parseInt(req.params.month);
  res.status(200).send('<pre>'+monthModule(year, month, 'darwin').toString()+'</pre>');
});

app.get('/cal/:year', (req, res) => {
  const yearModule = require('node-cal/lib/year').outputFullCal;
  const year = req.params.year;
  res.status(200).send('<pre>'+yearModule(year, 'darwin').toString()+'</pre>');
});

app.get('/cal', (req, res) => {
  const monthModule = require('node-cal/lib/month').joinOutput;
  let timeNow = new Date();
  let month = timeNow.getMonth()+1;
  let year = timeNow.getFullYear();

  res.status(200).send('<pre>'+monthModule(year, month, 'darwin').toString()+'</pre>');
});

app.all('*', (req,res) => {
  res.status(403).send('<h1>Access Denied</h1>');
});


app.listen(PORT, () => {
  console.log(`Node.js server started. Listening on port ${PORT}`);
});
