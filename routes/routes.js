'use strict';
const express = require('express');
const router = express.Router();

// REQUIRE DANGER ZONE

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded( {extended: false} ) );
router.use(bodyParser.json() );

var imgur = require('imgur');
const _ = require('lodash');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
//FILE UPLOADING:  const upload = require('multer')({dest: 'tmp/uploads'}); or
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.'+ fileExt(file))}
})
const fileExt = function(file) {
  myFileName = file.fieldname + '-' + Date.now() + '.'+ file.mimetype.slice(6);
  return file.mimetype.slice(6)
}

var upload = multer({ storage: storage })
// UPLOADING FILES END

// END DANGER ZONE



const News = require('../models/news');
const Allcaps = require('../models/allcaps');
const Contact = require('../models/contacts');
const Imgur = require('../models/imgur');

router.get('/', (req, res) => {
   News.findOne().sort('-_id').exec( (err, doc) => {
    if (err) throw err;

    const topTitle = doc.top[0].title;
    const topUrl = doc.top[0].url;

    const monthModule = require('node-cal/lib/month').joinOutput;
    let date = new Date();
    let month = date.getMonth()+1;
    let year = date.getFullYear();

    res.render('index', {
      title: 'Super Cool App',
      theCal: monthModule(year, month, 'darwin').toString(),
      date: date,
      month: month,
      year: year,
      topTitle: topTitle,
      topUrl: topUrl
    });
  });
});

router.get('/api', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send({'Hey':'Worldu'});
});

router.post('/api', (req, res) => {
  console.log(req.body);

  const obj = _.mapValues(req.body, val => val.toUpperCase())
  const caps = new AllCaps(obj);

  caps.save( (err, _result) => {
    if (err) throw err;

    console.log(_result);
    res.send(_result);
  });

});

//playing with web scraping
router.get('/api/news', (req, res) => {
  News.findOne().sort('-_id').exec( (err, doc) => {
    if (err) throw err;

    if (doc) {
      const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
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

        news.push({
          title: $('.banner-text').text(),
          url: `${url}${$('.banner-text').closest('a').attr('href')}`
        });

        _.range(1,12).forEach(i => {
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

});


router.get('/api/weather', (req, res) => {
  const url = 'https://api.forecast.io/forecast/b4ad2be4cd354044386a3efea6b15c18/37.8267,-122.423';
  request.get(url, (err, response, body) => {
    if (err) throw err;

    res.header('Access-Control-Allow-Origin', '*');
    res.send(JSON.parse(body));
  });
});

router.get('/hello', (req, res) => {
  res.writeHead(200, {
    'Content-type': 'text/html'
  });
  console.log('THOSE PARAMS!', req.query);
  var whodis = 'World';
  if (req.query.name) {
    whodis = req.query.name;
  }

  res.write('<h1>Yarp</h1>');
  const msg = `<h1>Hello ${whodis}!</h1>`;

  msg.split('').forEach((char, i) => {
    setTimeout(() => {
      res.write(char);
    }, 1000*i);
  });

  setTimeout(() => {
    res.end('<h3>Goodbye</h3>');
  }, 20000);

});

router.get(`/contact`, (req, res) => {
  res.render(`contact`);
});

router.post('/contact', (req, res) => {


  const contactContent = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });

  contactContent.save( (err, newObj) => {
    if (err) throw err;

    console.log(newObj);
    res.send(`<h1>THANKS FOR CONTACTING SOMEONE ${newObj.name}!</h1>`);
  });

  //db.collection('contact').insertOne(contactContent, (err, result) => {
    //if (err) throw err;
    //const name = req.body.name;
    //res.send(`<h1>THANKS FOR CONTACTING SOMEONE ${name}!</h1>`);
  //});

});

router.get('/sendphoto', (req, res) => {
  res.render('sendphoto');
});
var myFileName;
router.post('/sendphoto', upload.single('image'), (req, res) => {

  imgur.uploadFile(`tmp/uploads/${myFileName}`)
    .then(function (json) {
        console.log(json.data.link);

        const uploaded = new Imgur({
          name: myFileName,
          url: json.data.link
        })

        uploaded.save( (err, result) => {
          if (err) throw err;
          console.log(result);
        });


        res.end(`<h3><a href='${json.data.link}'>Your Image!</a></h3>`)

        fs.unlink(`tmp/uploads/${myFileName}`, function(err) {
            if (err) throw err;
        });

    })
    .catch(function (err) {
        console.error(err.message);
    });

  console.log(req.body);
  res.write(`<h1>We promise we won't do anything nefarious with it!</h1>`);
});

router.get('/random/:min/:max', (req, res) => {
  const mymin = req.params.min;
  const mymax = req.params.max;
  res.status(200).send((Math.floor(Math.random()*(mymax-mymin+1)+mymin)).toString());
});

router.get('/random', (req, res) => {
  res.status(200).send(Math.random().toString());
});

router.get('/cal/:year/:month', (req, res) => {
  const monthModule = require('node-cal/lib/month').joinOutput;
  const year = req.params.year;
  const month = parseInt(req.params.month);
  res.status(200).send('<pre>'+monthModule(year, month, 'darwin').toString()+'</pre>');
});

router.get('/cal/:year', (req, res) => {
  const yearModule = require('node-cal/lib/year').outputFullCal;
  const year = req.params.year;
  res.status(200).send('<pre>'+yearModule(year, 'darwin').toString()+'</pre>');
});

router.get('/cal', (req, res) => {
  const monthModule = require('node-cal/lib/month').joinOutput;
  let timeNow = new Date();
  let month = timeNow.getMonth()+1;
  let year = timeNow.getFullYear();

  res.status(200).send('<pre>'+monthModule(year, month, 'darwin').toString()+'</pre>');
});

router.all('/secret', (req,res) => {
  res.status(403).send('<h1>Access Denied</h1>');
});


module.exports = router;
