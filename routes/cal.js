'use strict';
const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/cal');

router.get('/cal/:year/:month', ctrl.month);
router.get('/cal/:year', ctrl.year);
router.get('/cal', ctrl.cal);

module.exports = router;
