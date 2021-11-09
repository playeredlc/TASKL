require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User').model;
const listService = require('../services/list.service');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const findOrCreate = require('mongoose-findorcreate');

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
  cookie: {maxAge: 31556952000} //31556952000ms = 1 year
};

// passport auth with GoogleOAuth2
config.googleStrategy = {
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: "https://glacial-garden-88459.herokuapp.com/auth/google/home"
	// callbackURL: "http://localhost:3000/auth/google/home"
};

config.passport = {
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
		passport.use(new LocalStrategy(
			function(username, password, done) {
				User.findOne({ username: username }, function(err, user) {
					if (err) { return done(err); }
					if (!user) {
						return done(null, false, { message: 'Incorrect username.' });
					}
					return done(null, user);
				});
			}
		));
	},
	
	google: () => {
		passport.use(new GoogleStrategy(
			config.googleStrategy, 
			(accessToken, refreshToken, profile, cb) => {
				User.findOrCreate({ googleId: profile.id }, { lists: listService.createDefault() }, (err, user) => {
					return cb(err, user);
				});
			}
		));
	}




}

module.exports = config;