'use strict';

const Contact = require('../models/contacts');
module.exports.index = (req, res) => {
  res.render(`contact`);
}

module.exports.sent = (req, res) => {
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
}
