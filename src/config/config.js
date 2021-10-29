require('dotenv').config();
const mongoose = require('mongoose');

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

module.exports = config;