'use strict';
const express = require('express');
const router = express.Router();

// UNCERTAIN ABOUT USAGE
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded( {extended: false} ) );
router.use(bodyParser.json() );
// END UNCERTAINTY

const statusOK = 200;

router.get('/cal/:year/:month', (req, res) => {
  const monthModule = require('node-cal/lib/month').joinOutput;
  const year = req.params.year;
  const month = parseInt(req.params.month);
  res.status(statusOK).send('<pre>' + monthModule(year, month, 'darwin').toString() + '</pre>');
});

router.get('/cal/:year', (req, res) => {
  const yearModule = require('node-cal/lib/year').outputFullCal;
  const year = req.params.year;
  res.status(statusOK).send('<pre>' + yearModule(year, 'darwin').toString() + '</pre>');
});

router.get('/cal', (req, res) => {
  const monthModule = require('node-cal/lib/month').joinOutput;
  const timeNow = new Date();
  const month = timeNow.getMonth() + 1;
  const year = timeNow.getFullYear();

  res.status(statusOK).send('<pre>' + monthModule(year, month, 'darwin').toString() + '</pre>');
});

module.exports = router;
