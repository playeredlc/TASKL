require('dotenv').config();
const mongoose = require('mongoose');
const userService = require('../services/user.service');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User').model;

let config = {};

// mongodb
config.database = {
	connection: () => {
		mongoose.connect('mongodb+srv://'+ process.env.DB_USER +':'+ process.env.DB_PASS + '@' + process.env.DB_CLUSTER + '.mongodb.net/' + process.env.DB_NAME, {useNewUrlParser: true, useUnifiedTopology: true});
	},
};

// express-session config
config.session = {
  secret: process.env.SECRET_STR,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 31556952000 } //31556952000ms = 1 year
};

// passport config
config.passport = {
	googleStrategy: {
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.PRODUCTION_DOMAIN + "/auth/google/home",
		// callbackURL: "http://localhost:3000/auth/google/home"
	},
	
	session: () => {
		passport.serializeUser(function (user, done) {
			done(null, user.id);
		});
		passport.deserializeUser(function (id, done) {
			User.findById(id, function (err, user) {
				done(err, user);
			});
		});
	},

	local: () => {
		passport.use(new LocalStrategy(User.authenticate()));
	},
	
	google: () => {
		passport.use(new GoogleStrategy(
			config.passport.googleStrategy, 
			async (accessToken, refreshToken, profile, cb) => {
				await userService.findOrCreate(profile.id, cb);
			}
		));
	},
};

module.exports = config;
