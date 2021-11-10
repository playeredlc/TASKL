const userService = require('../services/user.service');
const listService = require('../services/list.service');
const date = require('../utils/date');

exports.create = async (req, res) => {
	try {
		const userId = req.user._id;
		const listName = req.body.listName;

		const newListId = await listService.addList(userId, listName);

		res.redirect('/lists/' + newListId);

	} catch (err) {
		throw new Error(err.message);
	}
};

exports.add = async (req, res) => {
	try {
		const newItem = req.body.newItem;
		const listId = req.body.listID;
		const userId = req.body.userID;

		await listService.addTask(userId, listId, newItem);

		res.redirect('/lists/' + listId);

	} catch (err) {
		throw new Error(err.message);
	}
};

exports.delete = async (req, res) => {
	try {
		const itemIndex = req.body.itemIndex;
		const listId = req.body.listID;
		const userId = req.body.userID;

		await listService.deleteTask(userId, listId, itemIndex);

		res.redirect('/lists/' + listId);

	} catch (err) {
		throw new Error(err.message);
	}
};

exports.display = async (req, res) => {
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
		throw new Error(err.message);
	}
};

exports.destroy = async (req, res) => {
	try {
		await listService.deleteList(req.user._id, req.params.listId);
		
		res.redirect('/home');

	} catch (err) {
		throw new Error(err.message);
	}
};

exports.rename = async (req, res) => {
	try {
		await listService.renameList(req.user._id, req.params.listId, req.body.newListName);
		
		res.redirect('/lists/'+req.params.listId);

	} catch (err) {
		throw new Error(err.message);
	};
};
