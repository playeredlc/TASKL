const router = require('express-promise-router')();
const errorHandler = require('../middlewares/errorHandler');
const date = require('../utils/date');

router.get('/', (req, res) => {
  if(req.isAuthenticated()){
    res.redirect('/home');
  }
  else{
    res.redirect('/get-started');
  }
});

router.get('/get-started', (req, res) => {
  res.render('get-started', {
    auth: req.isAuthenticated(),
    date: date.getDate()
  });
});

router.get('/error', (req, res) => {
  const params = {
    auth: req.isAuthenticated(),
    date: date.getDate(),
    errMessage: req.session.errMessage || 'An unexpected error occurred.',
    returnPath: req.session.returnPath || '/',
  }
  res.render('error', params);
});

module.exports = router;
