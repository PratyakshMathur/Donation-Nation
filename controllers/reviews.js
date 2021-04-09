const Review = require('../models/review');
const Donations = require('../models/donations');

module.exports.createReview=async (req, res) => {
    const donation = await Donations.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    donation.reviews.push(review);
    await review.save();
    await donation.save();
    req.flash('success', 'Created new Review!')
    res.redirect(`/donate/${donation._id}`);
}

module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;
    await Donations.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted Review!')
    res.redirect(`/donate/${id}`);
}