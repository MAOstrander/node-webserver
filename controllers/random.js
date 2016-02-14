'use strict';

const statusOK = 200;

module.exports.rand = (req, res) => {
  res.status(statusOK).send(Math.random().toString());
}

module.exports.randQuery = (req, res) => {
  const mymin = req.params.min;
  const mymax = req.params.max;
  res.status(statusOK).send((Math.floor(Math.random() * (mymax - mymin + 1) + mymin)).toString());
}
