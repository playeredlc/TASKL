const userService = require('../services/user.service');
const listService = require('../services/list.service');
const date = require('../utils/date');

exports.create = async (req, res, next) => {
	try {
		const userId = req.user._id;
		const listName = req.body.listName;

		const newListId = await listService.addList(userId, listName);

		res.redirect('/list/' + newListId);

	} catch (err) {
		next(err);
	}
};

exports.add = async (req, res, next) => {
	try {
		const newItem = req.body.newItem;
		const listId = req.body.listID;
		const userId = req.body.userID;

		await listService.addTask(userId, listId, newItem);

		res.redirect('/list/' + listId);

	} catch (err) {
		next(err);
	}
};

exports.delete = async (req, res, next) => {
	try {
		const itemIndex = req.body.itemIndex;
		const listId = req.body.listID;
		const userId = req.body.userID;

		await listService.deleteTask(userId, listId, itemIndex);

		res.redirect('/list/' + listId);

	} catch (err) {
		next(err);
	}
};

exports.display = async (req, res, next) => {
	try {
		const user = await userService.findUser(req.user._id);
		const listIndex = await listService.getListIndex(user._id, req.params.listId)

		res.render('list', {
			auth: req.isAuthenticated(),
			date: date.getDate(),
			lists: user.lists,
			listIndex: listIndex,
			userID: user._id
		});

	} catch (err) {
		next(err);
	}
};

exports.destroy = async (req, res, next) => {
	try {
		await listService.deleteList(req.user._id, req.params.listId);
		
		res.redirect('/home');

	} catch (err) {
		next(err);
	}
};

exports.rename = async (req, res, next) => {
	try {
		await listService.renameList(req.user._id, req.params.listId, req.body.newListName);
		
		res.redirect('/list/'+req.params.listId);

	} catch (err) {
		next(err);
	};
};
