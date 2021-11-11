const router = require('express-promise-router')();
const listController = require('../controllers/list.controller');
const isAuth = require('../middlewares/isAuth');

router.get('/lists/create', isAuth, (req, res) => {
  res.render('new-list', {
    auth: req.isAuthenticated(),
    date: date.getDate()
  });
});
router.post('/lists/create', isAuth, listController.create);

router.get('/lists/:listId', isAuth, listController.display);
router.delete('/lists/:listId', isAuth, listController.destroy);
router.patch('/lists/:listId', isAuth, listController.rename);

router.get('/lists/rename/:listId', isAuth, (req, res) => {
  res.render('rename-list', {
    auth: req.isAuthenticated(),
    date: date.getDate()
  });
});

module.exports = router;
