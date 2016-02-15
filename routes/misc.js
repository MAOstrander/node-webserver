'use strict';
const express = require('express');
const router = express.Router();
const statusOK = 200;
const statusForbidden = 403;
const briefPause = 1000 // In ms = 1 scec
const longPause = 20000 // In ms = 20 sec

const News = require('../models/news');

router.get('/', (req, res) => {
  News.findOne().sort('-_id').exec( (err, doc) => {
    if (err) throw err;

    const topTitle = doc && doc.top && doc.top[0].title || '';
    const topUrl = doc && doc.top && doc.top[0].url || '';

    const monthModule = require('node-cal/lib/month').joinOutput;
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    res.render('index', {
      title: 'Super Cool App',
      theCal: monthModule(year, month, 'darwin').toString(),
      date: date,
      month: month,
      year: year,
      topTitle: topTitle,
      topUrl: topUrl
    });
  });
});


router.get('/hello', (req, res) => {
  res.writeHead(statusOK, {
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
    }, briefPause * i);
  });

  setTimeout(() => {
    res.end('<h3>Goodbye</h3>');
  }, longPause);

});

router.all('/secret', (req, res) => {
  res.status(statusForbidden).send('<h1>Access Denied</h1>');
});


module.exports = router;
