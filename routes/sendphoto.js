'use strict';
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded( {extended: false} ) );
router.use(bodyParser.json() );

const ctrl = require('../controllers/sendphoto');

router.get('/sendphoto', ctrl.index);
router.post('/sendphoto', ctrl.uploader, ctrl.poster);

module.exports = router;
