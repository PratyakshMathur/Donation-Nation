const Donations = require('../models/donations');

module.exports.index = async (req, res) => {
    const donation = await Donations.find({});
    res.render('donations/index', { who: "Donations", donation });
}

module.exports.renderNewForm = (req, res) => {
    res.render('donations/new', { who: "Create Donation" });
}

module.exports.createDonation=async (req, res, next) => {
    const donation = new Donations(req.body.donation);
    donation.author = req.user._id;
    await donation.save();
    req.flash('success', 'Successfully made a new donation!')
    res.redirect(`/donate/${donation._id}`)
}


module.exports.showDonation=async (req, res) => {
    
    const donation = await (await Donations.findById(req.params.id).populate(
        {
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).
        populate('author'));
        
    if (!donation) {
        req.flash('error', 'Cannot find that Donation');
        return res.redirect('/donate');
    }
    res.render('donations/show', { who: `${donation.title}`, donation });
}

module.exports.renderEditForm=async (req, res) => {
    const donation = await Donations.findById(req.params.id)
    if (!donation) {
        req.flash('error', 'Cannot find that Donation');
        return res.redirect('/donate');
    }
    res.render('donations/edit', { who: "Edit Donations", donation });
}

module.exports.updateDonation=async (req, res) => {
    const { id } = req.params;
    const donation = await Donations.findByIdAndUpdate(id, { ...req.body.donation });
    req.flash('success', 'Successfully updated donation!')
    res.redirect(`/donate/${donation._id}`)

}

module.exports.deleteDonation=async (req, res) => {
    const { id } = req.params;
    await Donations.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Donation!')
    res.redirect('/donate');
}