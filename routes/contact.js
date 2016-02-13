'use strict';
const express = require('express');
const router = express.Router();

// REQUIRE DANGER ZONE
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded( {extended: false} ) );
router.use(bodyParser.json() );
// END DANGER ZONE

const ctrl = require('../controllers/contact');

router.get(`/contact`, ctrl.index);
router.post('/contact', ctrl.sent);

module.exports = router;
