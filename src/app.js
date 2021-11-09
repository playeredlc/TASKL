require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const date = require('./utils/date');
const session = require('express-session');
const passport = require('passport');

const userService = require('./services/user.service');
const listService = require('./services/list.service');

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
app.get('/home', async (req, res) => {
  if(req.isAuthenticated()){
    
		const user = await userService.findUser(req.user._id);

    if(userService.hasList(user._id)){
      res.render('list', {
        auth: req.isAuthenticated(),
        date: date.getDate(),
        lists: user.lists,
        listIndex: 0,
        userID: user._id,
      });
    } else {
      res.render('empty-lists', {
        auth: req.isAuthenticated(),
        date: date.getDate()
      });
    }
  } else {
    res.redirect('/login');
  }

});

// HANDLE LIST CREATION
app.get('/new-list', async (req, res) => {
  if(req.isAuthenticated()){
    res.render('new-list', {
      auth: req.isAuthenticated(),
      date: date.getDate()
    });
  }else{
    res.redirect('/login');
  }
});
app.post('/new-list', async (req, res) => {
  // CREATE NEW LIST AND REDIRECT TO THE LIST
  if(req.isAuthenticated()){
    try {
			const userId = req.user._id;
			const listName = req.body.listName;
	
			const newListId = await listService.addList(userId, listName);

			res.redirect('/lists/'+newListId);
		} catch (err) {
			throw new Error(err.message);
		}	
	} else {
		res.redirect('/login');
	}
});

//HANDLE NEW TASKS BEING ADDED.
app.post('/add-item', async (req, res) => {
  if(req.isAuthenticated()){
    const newItem = req.body.newItem;
    const listId = req.body.listID;
    const userId = req.body.userID;
		
		await listService.addTask(userId, listId, newItem);

		res.redirect('/lists/'+listId);

  }else{
    res.redirect('login');
  } 
});

//HANDLE TASK DELETIONS
app.post('/delete-item', async (req, res) => {
  const itemIndex = req.body.itemIndex;
  const listId = req.body.listID;
  const userId = req.body.userID;

	await listService.deleteTask(userId, listId, itemIndex);

  res.redirect('/lists/'+listId);

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
app.post('/sign-up', async (req, res) => {
  try{
		await userService.createUser(req.body.username, req.body.password);
		
		passport.authenticate('local')(req ,res, () => {
			res.redirect('/');
		});
	
	} catch (err) {
		throw new Error(err.message);
	}

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
app.get('/lists/:listId', async (req, res) => {
  if(req.isAuthenticated()){
    const user = await userService.findUser(req.user._id);
		const listIndex = await listService.getListIndex(user._id, req.params.listId)

		res.render('list', {
			auth: req.isAuthenticated(),
			date: date.getDate(),
			lists: user.lists,
			listIndex: listIndex,
			userID: user._id
		});

  }else{
    res.redirect('/login');
  }
});

// HANDLE LIST DELETIONS
app.get('/delete-list/:listId', async (req, res) => {
  if(req.isAuthenticated()){
		await listService.deleteList(req.user._id, req.params.listId);
		res.redirect('/home');		
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
app.post('/rename/:listId', async (req, res) => {
  if(req.isAuthenticated()){
    await listService.renameList(req.user._id, req.params.listId, req.body.newListName);
		res.redirect('/lists/'+req.params.listId);
  }else{
    res.redirect('/login');
  }
});

module.exports = app;
