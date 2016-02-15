'use strict';


const _ = require('lodash');
const request = require('request');
const cheerio = require('cheerio');

const News = require('../models/news');
const Allcaps = require('../models/allcaps');

module.exports.hello = (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send({'Hey':'Worldu'});
};

module.exports.allcaps = (req, res) => {
  console.log(req.body);

  const obj = _.mapValues(req.body, val => val.toUpperCase())
  const caps = new Allcaps(obj);

  caps.save( (err, _result) => {
    if (err) throw err;

    console.log(_result);
    res.send(_result);
  });
};

module.exports.weather = (req, res) => {
  const url = 'https://api.forecast.io/forecast/b4ad2be4cd354044386a3efea6b15c18/37.8267,-122.423';
  request.get(url, (err, response, body) => {
    if (err) throw err;

    res.header('Access-Control-Allow-Origin', '*');
    res.send(JSON.parse(body));
  });
};

module.exports.news = (req, res) => {
  News.findOne().sort('-_id').exec( (err, doc) => {
    if (err) throw err;

    if (doc) {
      const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000; // eslint-disable-line no-magic-numbers
      const diff = new Date() - doc._id.getTimestamp() - FIFTEEN_MINUTES_IN_MS;
      const lessThan15MinutesAgo = diff < 0;

      if (lessThan15MinutesAgo) {
        res.send(doc);
        return;
      }
    }

    const url = 'http://cnn.com';

    request.get(url, (err, response, html) => {
      if (err) throw err;
      const news = [];
      const $ = cheerio.load(html);
      const storiesToGrab = 12;

      news.push({
        title: $('.banner-text').text(),
        url: `${url}${$('.banner-text').closest('a').attr('href')}`
      });

      _.range(1, storiesToGrab).forEach(i => {
        news.push({
          title: $('.cd__headline').eq(i).text(),
          url: `${url}${$('.cd__headline').eq(i).find('a').attr('href')}`
        });
      });

      const obj = new News({ top: news });
      obj.save((err, result) => {
        if (err) throw err;
        res.send(result);
      });
    });
  });
};
