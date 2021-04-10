const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Donations = require('../models/donations');
const { isLoggedIn, validateDonation, isAuthor } = require('../middleware');
const donations=require('../controllers/donations')
const multer  = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });



router.route('/')
    .get(catchAsync(donations.index))
    .post(isLoggedIn, upload.array('image'), validateDonation, catchAsync(donations.createDonation))


router.get('/new', isLoggedIn, donations.renderNewForm)

router.route('/:id') 
    .get(catchAsync(donations.showDonation))
    .put( isLoggedIn, isAuthor, upload.array('image'), validateDonation, catchAsync(donations.updateDonation))
    .delete( isLoggedIn, isAuthor, catchAsync(donations.deleteDonation))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(donations.renderEditForm))

module.exports = router;