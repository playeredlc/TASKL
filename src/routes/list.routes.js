const router = require('express-promise-router')();
const listController = require('../controllers/list.controller');
const date = require('../utils/date');
const isAuth = require('../middlewares/isAuth');

router.get('/list/:listId', isAuth, listController.display);
router.get('/lists/remove/:listId', isAuth, listController.destroy);

router.get('/lists/create', isAuth, (req, res) => {
  res.render('new-list', {
    auth: req.isAuthenticated(),
    date: date.getDate()
  });
});
router.post('/lists/create', isAuth, listController.create);
router.get('/lists/rename/:listId', isAuth, (req, res) => {
  res.render('rename-list', {
    auth: req.isAuthenticated(),
    date: date.getDate()
  });
});
router.post('/lists/rename/:listId', isAuth, listController.rename);
router.post('/lists/delete-task', isAuth, listController.delete);
router.post('/lists/add-task', isAuth, listController.add);

module.exports = router;
