const router = require('express-promise-router')();
const userController = require('../controllers/user.controller');
const date = require('../utils/date');
const passport = require('passport');
const isAuth = require('../middlewares/isAuth');

router.get('/home', isAuth, userController.getById);

router.get('/login', (req, res) => {
  res.render('login', {
    auth: req.isAuthenticated(),
    date: date.getDate()
  });
});
router.post('/login',
  passport.authenticate(
    'local',
    {
      successRedirect: '/',
      failureRedirect: 'login',
    }
  )
);

router.get('/sign-up', (req, res) => {
  res.render('sign-up', {
    auth: req.isAuthenticated(),
    date: date.getDate()
  })
});
router.post('/sign-up', userController.register);

router.get('/logout', userController.logout);

router.get('/auth/google', 
  passport.authenticate(
    'google',
    { scope:['profile'] }
  )
);
router.get('/auth/google/home',
	passport.authenticate(
		'google',
		{
			successRedirect: '/',
			failureRedirect: '/login',
		}
	)
);

module.exports = router;
