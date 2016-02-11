"use strict";
const express = require('express');
const app = express();
// or const app = require('express')();
const bodyParser = require('body-parser');
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
const sassMiddleware = require('node-sass-middleware');

//connecting Mongo
const MongoClient = require('mongodb').MongoClient
let db;


var path = require('path');
app.set('view engine', 'jade');
let PORT = process.env.PORT || 3000;

//More mongo goodness
const MONGO_URL = 'mongodb://localhost:27017/node-webserver';

app.locals.title = `Mat's Super Cool App`;

app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded( {extended: false} ) );
app.use(bodyParser.json() );


app.get('/', (req, res) => {
  const monthModule = require('node-cal/lib/month').joinOutput;
  let date = new Date();
  let month = date.getMonth()+1;
  let year = date.getFullYear();

  res.render('index', {
    title: 'Super Cool App',
    theCal: monthModule(year, month, 'darwin').toString(),
    date: date,
    month: month,
    year: year
  });
});

app.get('/api', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send({'Hey':'Worldu'});
});

app.post('/api', (req, res) => {
  console.log(req.body);

  const obj = _.mapValues(req.body, val => val.toUpperCase())

  db.collection('')

  res.send(obj);
});

//playing with web scraping
app.get('/api/news', (req, res) => {
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

    res.send(news);
  });
});


app.get('/api/weather', (req, res) => {
  const url = 'https://api.forecast.io/forecast/b4ad2be4cd354044386a3efea6b15c18/37.8267,-122.423';
  request.get(url, (err, response, body) => {
    if (err) throw err;

    res.header('Access-Control-Allow-Origin', '*');
    res.send(JSON.parse(body));
  });
});

app.get('/hello', (req, res) => {
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

app.get(`/contact`, (req, res) => {
  res.render(`contact`);
});

app.post('/contact', (req, res) => {
  const name = req.body.name;
  res.send(`<h1>THANKS FOR CONTACTING SOMEONE ${name}!</h1>`);
});

app.get('/sendphoto', (req, res) => {
  res.render('sendphoto');
});
var myFileName;
app.post('/sendphoto', upload.single('image'), (req, res) => {

  imgur.uploadFile(`tmp/uploads/${myFileName}`)
    .then(function (json) {
        console.log(json.data.link);
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

app.get('/random/:min/:max', (req, res) => {
  const mymin = req.params.min;
  const mymax = req.params.max;
  res.status(200).send((Math.floor(Math.random()*(mymax-mymin+1)+mymin)).toString());
});

app.get('/random', (req, res) => {
  res.status(200).send(Math.random().toString());
});

app.get('/cal/:year/:month', (req, res) => {
  const monthModule = require('node-cal/lib/month').joinOutput;
  const year = req.params.year;
  const month = parseInt(req.params.month);
  res.status(200).send('<pre>'+monthModule(year, month, 'darwin').toString()+'</pre>');
});

app.get('/cal/:year', (req, res) => {
  const yearModule = require('node-cal/lib/year').outputFullCal;
  const year = req.params.year;
  res.status(200).send('<pre>'+yearModule(year, 'darwin').toString()+'</pre>');
});

app.get('/cal', (req, res) => {
  const monthModule = require('node-cal/lib/month').joinOutput;
  let timeNow = new Date();
  let month = timeNow.getMonth()+1;
  let year = timeNow.getFullYear();

  res.status(200).send('<pre>'+monthModule(year, month, 'darwin').toString()+'</pre>');
});

app.all('/secret', (req,res) => {
  res.status(403).send('<h1>Access Denied</h1>');
});


MongoClient.connect(MONGO_URL, (err, datab) => {
  if (err) throw err;

  db = datab;

  datab.collection('namegoeshere').insertMany([
    {a: 'b'},{c: 'd'},{e: 'f'}
  ], (err, res) => {
    if (err) throw err;

    console.log(res);
  });


  app.listen(PORT, () => {
    console.log(`Node.js server started. Listening on port ${PORT}`);
  });
});
