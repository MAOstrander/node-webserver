'use strict';

const statusOK = 200;

module.exports.month = (req, res) => {
  const monthModule = require('node-cal/lib/month').joinOutput;
  const year = req.params.year;
  const month = parseInt(req.params.month);
  res.status(statusOK).send('<pre>' + monthModule(year, month, 'darwin').toString() + '</pre>');
};

module.exports.year = (req, res) => {
  const yearModule = require('node-cal/lib/year').outputFullCal;
  const year = req.params.year;
  res.status(statusOK).send('<pre>' + yearModule(year, 'darwin').toString() + '</pre>');
};

module.exports.cal = (req, res) => {
  const monthModule = require('node-cal/lib/month').joinOutput;
  const timeNow = new Date();
  const month = timeNow.getMonth() + 1;
  const year = timeNow.getFullYear();

  res.status(statusOK).send('<pre>' + monthModule(year, month, 'darwin').toString() + '</pre>');
};
