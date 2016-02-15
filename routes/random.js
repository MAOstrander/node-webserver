'use strict';
const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/random');

router.get('/random/:min/:max', ctrl.randQuery);
router.get('/random', ctrl.rand);

module.exports = router;
