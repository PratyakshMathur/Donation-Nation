const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const passport = require('passport');
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const user = require('../models/user');
const gPass = process.env.GMAILPW
const users = require('../controllers/users')

router.route('/register')
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router.route('/login')
  .get(users.renderLogin)
  .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

// forgot password
router.route('/forgot')
  .get( users.renderForget)
  .post(users.forgetPassMail)

router.route('/reset/:token')
  .get( users.resetToken)
  .post( users.resetPass)

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'donation.nation.21@gmail.com',
    pass: gPass
  }
})

router.post('/send_email', (req, res) => {

  mail = {
    to: 'donation.nation.21@gmail.com',
    subject: 'Contact from ' + req.body.name,
    body: req.body.message
  }
  Sendemail_Contact(mail)
  res.redirect('/')

  function Sendemail_Contact(mail) {
    var mailOptions1 = {
      to: 'donation.nation.21@gmail.com',
      from: req.body.email_contact,
      subject: mail.subject,
      text: mail.body
    }
    smtpTransport.sendMail(mailOptions1, function (err, info) {
      if (err) {
        console.log(err)
      }
      else {
        console.log('Email sent')
      }

    })
  }
})

module.exports = router;