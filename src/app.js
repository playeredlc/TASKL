require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const _ = require('lodash');
const date = require('./utils/date');
const session = require('express-session');
const passport = require('passport');
// const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
// const findOrCreate = require('mongoose-findorcreate');

const config = require('./config/config');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//express-session config
app.use(session(config.session));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//CONNECT TO DB
config.database.connection();

const User = require('./models/User').model;
const List = require('./models/List').model;

//session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//Set authentication strategies
//local: username/password
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
//google auth2.0:
passport.use(new GoogleStrategy(
  config.googleStrategy, 
  (accessToken, refreshToken, profile, cb) => {
    const defaultList = new List({
      name: 'Quick List',
      items: ['Welcome to your TASKList', 'Hit the + button to add a new task', 'Use the checkbox to discard accomplished tasks.']
    });
    User.findOrCreate({ googleId: profile.id }, { lists: defaultList }, (err, user) => {
      return cb(err, user);
    });
  }
));

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
    User.findById(req.user._id, (err, user) => {
      if(!err){
        if(user.lists.length == 0){
          res.render('empty-lists', {
            auth: req.isAuthenticated(),
            date: date.getDate()
          });
        }else{
          res.render('list', {
            auth: req.isAuthenticated(),
            date: date.getDate(),
            lists: user.lists,
            listIndex: 0,
            userID: user._id
          });
        }
      }else{
        console.log(err);
      }
    });
  }else{
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
    User.findById(req.user._id, (err, user) => {
      if(!err){
        const newList = new List ({
          name: req.body.listName,
          items: new Array()
        });
        user.lists.push(newList);
        user.save();
        res.redirect('/lists/'+newList._id);
      }else{
        console.log(err);
      }
    })
  }else{
    res.redirect('/login');
  }
});

//HANDLE NEW TASKS BEING ADDED.
app.post('/add-item', (req, res) => {
  if(req.isAuthenticated()){
    const newItem = req.body.newItem;
    const listID = req.body.listID;
    const userID = req.body.userID;
  
    User.findById(userID, (err, user) => {
      if(!err){
        user.lists.id(listID).items.push(newItem);
        user.save(() => {
          res.redirect('/lists/'+listID); 
        });
      }else{
        console.log(err);
      }
    });
  }else{
    res.redirect('login');
  } 
});

//HANDLE TASK DELETIONS
app.post('/delete-item', (req, res) => {
  const itemIndex = req.body.itemIndex;
  const listID = req.body.listID;
  const userID = req.body.userID;

  User.findById(userID, (err, user) =>{
    user.lists.id(listID).items.splice(itemIndex, 1);
    user.save(()=>{
      res.redirect('/lists/'+listID);
    });
  });
});

// LOG USER IN
app.get('/login', (req, res) => {
  res.render('login', {
    auth: req.isAuthenticated(),
    date: date.getDate()
  });
});
app.post('/login',
  passport.authenticate('local', {successRedirect: '/',
  failureRedirect: 'login'
  })
);

// LOG USER OUT
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

// REGISTER USER
app.get('/sign-up', (req, res) => {
  res.render('sign-up', {
    auth: req.isAuthenticated(),
    date: date.getDate()
  })
});
app.post('/sign-up', (req, res) => {
  User.register({username: req.body.username}, req.body.password, (err, user) => {
    if(!err){
      passport.authenticate('local')(req, res, () => {
        const defaultList = new List({
          name: 'Quick List',
          items: ['Welcome to your TASKList', 'Hit the + button to add a new task', 'Use the checkbox to discard accomplished tasks.']
        });
        user.lists.push(defaultList);
        user.save(() => {
          res.redirect('/');
        });
      });
    }else{
      console.log(err);
    }
  });
});

// AUTHENTICATE WITH GOOGLE OAUTH2.0
app.get('/auth/google', 
  passport.authenticate('google', {scope:['profile']})
);
//CALLBACK OF GOOGLE OAUTH2.0
app.get('/auth/google/home', 
  passport.authenticate('google', {failureRedirect: '/login'}),
  (req, res) => {
    res.redirect('/');
  }
);

// DISPLAY SPECIFIC LIST
app.get('/lists/:listID', (req, res) => {
  if(req.isAuthenticated()){
    User.findById(req.user._id, (err, user) => {
      if(!err){
        const listIndex = user.lists.indexOf(user.lists.id(req.params.listID));
        res.render('list', {
          auth: req.isAuthenticated(),
          date: date.getDate(),
          lists: user.lists,
          listIndex: listIndex,
          userID: user._id
        });
      }else{
        console.log(err);
      }
    });
  }else{
    res.redirect('/login');
  }
});

// HANDLE LIST DELETIONS
app.get('/delete-list/:listID', (req, res) => {
  if(req.isAuthenticated()){
    User.findById(req.user._id, (err, user) => {
      if(!err){
        const listIndex = user.lists.indexOf(user.lists.id(req.params.listID));
        user.lists.splice(listIndex, 1);
        user.save(() => {
          res.redirect('/home');
        });
      }else{
        console.log(err);
      }
    });
  }else{
    res.redirect('/login');
  }
});

// HANDLE LIST RENAMING
app.get('/rename/:listID', (req, res) => {
  if(req.isAuthenticated()){
    res.render('rename-list', {
      auth: req.isAuthenticated(),
      date: date.getDate()
    });
  }else{
    res.redirect('/login');
  }
});
app.post('/rename/:listID', (req, res) => {
  if(req.isAuthenticated()){
    User.findById(req.user._id, (err, user) => {
      if(!err){
        const listIndex = user.lists.indexOf(user.lists.id(req.params.listID));
        user.lists[listIndex].name=req.body.newListName;
        user.save(() => {
          res.redirect('/lists/'+req.params.listID);
        })
      }else{
        console.log(err);
      }
    })
  }else{
    res.redirect('/login');
  }
});


module.exports = app;