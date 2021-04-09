const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Donations = require('../models/donations');

mongoose.connect('mongodb://localhost:27017/donation-nation', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Donations.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 100;
        const camp = new Donations({
            author:'604b7f3279aa402c8c2fed42',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/3177997/1600x900',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.Amet ut quibusdam quia, dolore vitae nobis sint, fugiat facilis eaque tempore autem illum ducimus? Dolores explicabo qui sapiente perspiciatis voluptatum reiciendis.',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})