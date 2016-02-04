"use strict";
const express = require('express');
const app = express();
// or const app = require('express')();
const bodyParser = require('body-parser');
var imgur = require('imgur');
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

var path = require('path');
app.set('view engine', 'jade');
let PORT = process.env.PORT || 3000;

app.locals.title = `Mat's Super Cool App`;

app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
}));
app.use(express.static(path.join(__dirname, 'public')));

//app.use(bodyParser.urlencoded( {extended: false} ) );


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
    })
    .catch(function (err) {
        console.error(err.message);
    });

  console.log(req.body);
  res.send(`<h1>We promise we won't do anything nefarious with it!</h1>`);
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


app.listen(PORT, () => {
  console.log(`Node.js server started. Listening on port ${PORT}`);
});
