require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');

const initialRoute = require('./routes/initial.routes');
const listRoute = require('./routes/list.routes');
const userRoute = require('./routes/user.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const config = require('./config/config');

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: 'application/vnd.api+json' }));

//mongodb connection
config.database.connection();

//express-session config
app.use(session(config.session));

//initialize and configure passport
app.use(passport.initialize());
app.use(passport.session());
config.passport.session();
config.passport.local();
config.passport.google();

//routes in use
app.use(initialRoute);
app.use(listRoute);
app.use(userRoute);

app.all('*', (req, res, next) => {
  res.status(404);
  next(new Error('Page not found!')) 
});

//middleware
app.use(errorHandler);

module.exports = app;
