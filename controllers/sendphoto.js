'use strict';



var imgur = require('imgur');
const fs = require('fs');
const Imgur = require('../models/imgur');
// FILE UPLOADING:  const upload = require('multer')({dest: 'tmp/uploads'}); or
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + fileExt(file))
  }
})
var myFileName;
const fileExt = function (file) {
  var mimetypePrefix = 6; // mimetypePrefix = 'image/'
  myFileName = file.fieldname + '-' + Date.now() + '.' + file.mimetype.slice(mimetypePrefix);
  return file.mimetype.slice(mimetypePrefix)
}

var upload = multer({ storage: storage })
// UPLOADING FILES END


module.exports.index = (req, res) => {
  res.render('sendphoto');
}


module.exports.uploader = upload.single('image');

module.exports.poster = (req, res) => {

  imgur.uploadFile(`tmp/uploads/${myFileName}`)
    .then((json) => {
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

      fs.unlink(`tmp/uploads/${myFileName}`, (err) => {
        if (err) throw err;
      });

    }).catch((err) => {
      console.error(err.message);
    })

  console.log(req.body);
  res.write(`<h1>We promise we won't do anything nefarious with it!</h1>`);
};
