'use strict';
const express = require('express');
const router = express.Router();
const statusOK = 200;

// REQUIRE DANGER ZONE
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded( {extended: false} ) );
router.use(bodyParser.json() );
// END DANGER ZONE

router.get('/random/:min/:max', (req, res) => {
  const mymin = req.params.min;
  const mymax = req.params.max;
  res.status(statusOK).send((Math.floor(Math.random() * (mymax - mymin + 1) + mymin)).toString());
});

router.get('/random', (req, res) => {
  res.status(statusOK).send(Math.random().toString());
});


module.exports = router;
