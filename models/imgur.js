'use strict';
const mongoose = require('mongoose');

module.exports = mongoose.model('imgur',
	mongoose.Schema({
  name: String,
  url: String
	})
);
