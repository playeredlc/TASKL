const List = require('../models/List').model;
const userService = require('./user.service');

exports.createList = async (listName) => {
	try {
		const newList = new List({
			name: listName,
			items: new Array(),
		})

		return newList;

	} catch (err){
		throw new Error(err.message);
	}
};

exports.createDefault = async () => {
	const defaultItems = [
		'Welcome to your TASKList',
		'Hit the + button to add a new task', 
		'Use the checkbox to discard accomplished tasks.'
	];
	
	try {
		const defaultList = new List({
			name: 'Quick List',
			items: defaultItems,
		});

		return defaultList;

	} catch (err) {
		throw new Error(err.message);
	}
};

exports.addTask = async (userId, listId, item) => {
	try {
		const user = await userService.findUser(userId);
		user.lists.id(listId).items.push(item);
		user = await user.save();
		
		return user;

	} catch (err) {
		throw new Error(err.message);
	}
};

exports.deleteTask = async (userId, listId, itemIndex) => {
	try {
		const user = await userService.findUser(userId);
		user.lists.id(listId).items.splice(itemIndex, 1);
		user = await user.save();

		return user;

	} catch(err) {
		throw new Error(err.message);
	}
};

exports.getListIndex = async (userId, listId) => {
	try {
		const user = await userService.findUser(userId);
		const index = user.lists.indexOf(user.lists.id(listId));

		return index;

	} catch (err) {
		throw new Error(err.message);
	}
};

exports.addList = async (userId, listName) => {
	try {
		const newList = this.createList(listName);
		const user = await userService.findUser(userId);
		user.lists.push(newList);
		user.save();

		return newList._id;

	} catch (err) {
		throw new Error(err.message);
	}
};

exports.deleteList = async (userId, listId) => {
	try {
		const user = await userService.findUser(userId);
		const index = this.getListIndex(listId);
		user.lists.splice(listIndex, 1);
		user = await user.save();

		return index;

	} catch (err) {
		throw new Error(err.message);
	}
};

exports.renameList = async (userId, listId, newName) => {
	try {
		const user = await userService.findUser(userId);
		const index = this.getListIndex(listId);

		user.lists[index].name = newName;
		user = await user.save();

		return listId;

	} catch(err) {
		throw new Error(err.message);
	}
};
