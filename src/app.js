require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const date = require('./utils/date');
const session = require('express-session');
const passport = require('passport');

const listController = require('./controllers/list.controller');
const userController = require('./controllers/user.controller');
const isAuth = require('./middlewares/isAuth');

const config = require('./config/config');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
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

// ROOT ROUTE
app.get('/', (req, res) => {
  if(req.isAuthenticated()){
    res.redirect('/home');
  }
  else{
    res.redirect('/get-started');
  }
});

app.get('/get-started', (req, res) => {
  res.render('get-started', {
    auth: req.isAuthenticated(),
    date: date.getDate()
  });
});

// HOME PAGE (LOGGED IN USER)
app.get('/home', isAuth, userController.getById);

// LOG USER IN
app.get('/login', (req, res) => {
  res.render('login', {
    auth: req.isAuthenticated(),
    date: date.getDate()
  });
});
app.post('/login',
    passport.authenticate(
      'local',
      {
        successRedirect: '/',
        failureRedirect: 'login',
      }
    )
);

// LOG USER OUT
app.get('/logout', userController.logout);

// REGISTER USER
app.get('/sign-up', (req, res) => {
  res.render('sign-up', {
    auth: req.isAuthenticated(),
    date: date.getDate()
  })
});
app.post('/sign-up', userController.register);

// AUTHENTICATE WITH GOOGLE OAUTH2.0
app.get('/auth/google', 
  passport.authenticate(
    'google',
    { scope:['profile'] }
  )
);
//CALLBACK OF GOOGLE OAUTH2.0
app.get('/auth/google/home', 
  passport.authenticate(
    'google',
    {
      successRedirect: '/',
      failureRedirect: '/login',
    }
  )
);

const listRoute = require('./routes/list.routes');
app.use(listRoute);

module.exports = app;
