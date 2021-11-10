require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const date = require('./utils/date');
const session = require('express-session');
const passport = require('passport');

const listController = require('./controllers/list.controller');
const userController = require('./controllers/user.controller');


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
app.get('/home', (req, res) => {
  if(req.isAuthenticated()){
    userController.getById(req, res);
  } else {
    res.redirect('/login');
  }
});

// HANDLE LIST CREATION
app.get('/new-list', (req, res) => {
  if(req.isAuthenticated()){
    res.render('new-list', {
      auth: req.isAuthenticated(),
      date: date.getDate()
    });
  }else{
    res.redirect('/login');
  }
});
app.post('/new-list', (req, res) => {
  // CREATE NEW LIST AND REDIRECT TO THE LIST
  if(req.isAuthenticated()){
    listController.create(req, res);	
	} else {
		res.redirect('/login');
	}
});

//HANDLE NEW TASKS BEING ADDED.
app.post('/add-item', (req, res) => {
  if(req.isAuthenticated()){
    listController.add(req, res);
  }else{
    res.redirect('login');
  } 
});

//HANDLE TASK DELETIONS
app.post('/delete-item', listController.delete);

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

// DISPLAY SPECIFIC LIST
app.get('/lists/:listId', (req, res) => {
  if(req.isAuthenticated()){
    listController.display(req, res);
  }else{
    res.redirect('/login');
  }
});

// HANDLE LIST DELETIONS
app.get('/delete-list/:listId', (req, res) => {
  if(req.isAuthenticated()){
    listController.destroy(req, res);
  }else{
    res.redirect('/login');
  }
});

// HANDLE LIST RENAMING
app.get('/rename/:listId', (req, res) => {
  if(req.isAuthenticated()){
    res.render('rename-list', {
      auth: req.isAuthenticated(),
      date: date.getDate()
    });
  }else{
    res.redirect('/login');
  }
});
app.post('/rename/:listId', (req, res) => {
  if(req.isAuthenticated()){
    listController.rename(req, res);
  }else{
    res.redirect('/login');
  }
});

module.exports = app;
