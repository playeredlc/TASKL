const userService = require('../services/user.service');
const listService = require('../services/list.service');
const passport = require('passport');
const date = require('../utils/date');
const url = require('url');

exports.getById = async (req, res) => {
  try {
    const user = await userService.findUser(req.user._id);

    if(await userService.hasList(user._id)){
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
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.login = async (req, res, next) => {
  try {
    
    const authentication = await passport.authenticate('local', (err, user, info) => {
      if(err) { return next(err) }
      if(!user) { return res.redirect('/login'); }
  
      req.login(user, (err) => {
        if(err) { return next(err) };
        return res.redirect('/');
      });
    });

    authentication(req, res, next);

  } catch (err) {
    throw new Error(err.message);
  }
};

exports.logout = (req, res) => {
  try {
    req.logout();
    res.redirect('/');
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.register = async (req, res) => {
  try{
		await userService.createUser(req.body.username, req.body.password);
		
		passport.authenticate('local')(req ,res, () => {
			res.redirect('/');
		});
	
	} catch (err) {
		throw new Error(err.message);
	}
};
