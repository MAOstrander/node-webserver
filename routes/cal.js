'use strict';
const express = require('express');
const router = express.Router();

// UNCERTAIN ABOUT USAGE
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded( {extended: false} ) );
router.use(bodyParser.json() );
// END UNCERTAINTY

const ctrl = require('../controllers/cal');

router.get('/cal/:year/:month', ctrl.month);
router.get('/cal/:year', ctrl.year);
router.get('/cal', ctrl.cal);

module.exports = router;
