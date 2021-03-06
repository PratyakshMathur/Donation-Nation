// ----------------------------------------------------------------------------------------------------//
if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const methodOverride=require('method-override');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const ExpressError = require('./utils/ExpressError');
const app = express();
const db = mongoose.connection;
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const bodyParser = require('body-parser')
app.use(express.urlencoded({ extended: true }));
const { isLoggedIn } = require('./middleware');

const userRoutes = require('./routes/users');
const donationRo = require('./routes/donationRo');
const reviews = require('./routes/reviews');
const user = require('./models/user');

const MongoDBStore=require("connect-mongo")(session);
const dbUrl='mongodb://localhost:27017/donation-nation';
const store=new MongoDBStore({
    url:dbUrl,
    secret: 'thisshouldbeabettersecret!',
    touchAfter: 24 * 60 * 60
})

store.on("error", function (e) {
    console.log("Session Error",e)
})

const sessionConfig = {
    store,
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
// ----------------------------------------------------------------------------------------------------//

// ----------------------------------------------------------------------------------------------------//
app.use(session(sessionConfig))
app.use(flash());
app.use(methodOverride('_method'))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')))
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/donate', donationRo);
app.use('/donate/:id/reviews', reviews);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ----------------------------------------------------------------------------------------------------//

// 'mongodb://localhost:27017/donation-nation'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected")
});

// ----------------------------------------------------------------------------------------------------//

app.get('/', (req, res) => {
    res.render('home', { who: "Home" })
})
app.get('/home', (req, res) => {
        res.render('home', { who: "Home" })
})

app.get('/aboutUs', (req, res) => {

    res.render('aboutUs', { who: "About Us" })
})
app.get('/blog', (req, res) => {
    res.render('blog', { who: "Blogs" })
})


app.get('/contact', (req, res) => {
    res.render('contact', { who: "Contact Us" })
})

// ----------------------------------------------------------------------------------------------------//

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something went wrong'
    res.status(statusCode).render('error', { who: "Error", err });
})

// ----------------------------------------------------------------------------------------------------//
app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000")
})
// ----------------------------------------------------------------------------------------------------//




