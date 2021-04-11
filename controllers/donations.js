const Donations = require('../models/donations');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const donation = await Donations.find({});
    res.render('donations/index', { who: "Donations", donation });
}

module.exports.renderNewForm = (req, res) => {
    res.render('donations/new', { who: "Create Donation" });
}

module.exports.createDonation=async (req, res, next) => {

    const geoData = await geocoder.forwardGeocode({
        query: req.body.donation.location,
        limit: 1
    }).send()
    const donation = new Donations(req.body.donation);
    donation.geometry=geoData.body.features[0].geometry;

   
    
    donation.images = req.files.map(f => ({ url: f.path, filename: f.filename }));

    donation.author = req.user._id;
    await donation.save();
    console.log(donation);
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
    console.log(req.body)
    const donation = await Donations.findByIdAndUpdate(id, { ...req.body.donation });
    const imgs=req.files.map(f => ({ url: f.path, filename: f.filename }))
    donation.images.push(...imgs);
    await donation.save()

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
       await donation.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(donation)
    }

    req.flash('success', 'Successfully updated donation!')
    res.redirect(`/donate/${donation._id}`)

}

module.exports.deleteDonation=async (req, res) => {
    const { id } = req.params;
    await Donations.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Donation!')
    res.redirect('/donate');
}