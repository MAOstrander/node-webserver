'use strict';
const express = require('express');
const router = express.Router();

const api = require('./api');
const cal = require('./cal');
const contact = require('./contact');
const misc = require('./misc');
const random = require('./random');
const sendphoto = require('./sendphoto');

router.use(api);
router.use(cal);
router.use(contact);
router.use(random);
router.use(misc);
router.use(sendphoto);

module.exports = router;
