'use strict';
const express = require('express');
const router = express.Router();

// UNCERTAIN ABOUT USAGE
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded( {extended: false} ) );
router.use(bodyParser.json() );
// END UNCERTAINTY

const ctrl = require('../controllers/api');

router.get('/api', ctrl.hello);
router.post('/api', ctrl.allcaps);

// Playing with web scraping
router.get('/api/news', ctrl.news);

router.get('/api/weather', ctrl.weather);


module.exports = router;
