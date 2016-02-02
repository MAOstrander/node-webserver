"use strict";
const express = require('express');
const app = express();
// or const app = require('express')();

let PORT = process.env.PORT || 3000;

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

app.get('/random', (req, res) => {
  res.status(200).send(Math.random().toString());
});

app.get('/random/:min/:max', (req, res) => {
  const mymin = req.params.min;
  const mymax = req.params.max;
  res.status(200).send((Math.floor(Math.random()*(mymax-mymin+1)+mymin)).toString());
});

app.get('/cal', (req, res) => {
  const monthModule = require('node-cal/lib/month');
  const theCal = require('node-cal/cal');
  console.log(theCal());
});

app.all('*', (req,res) => {
  res.status(403).send('<h1>Access Denied</h1>');
});


app.listen(PORT, () => {
  console.log(`Node.js server started. Listening on port ${PORT}`);
});
