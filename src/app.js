require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');

const config = require('./config/config');

const app = express();

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: 'application/vnd.api+json' }));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//express-session config
app.use(session(config.session));

//CONNECT TO DB
config.database.connection();

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

// configure passport
config.passport.session();
config.passport.local();
config.passport.google();

const initialRoute = require('./routes/initial.routes');
const listRoute = require('./routes/list.routes');
const userRoute = require('./routes/user.routes');
app.use(initialRoute);
app.use(listRoute);
app.use(userRoute);

module.exports = app;
