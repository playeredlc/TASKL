const List = require('../models/List').model;
const userService = require('./user.service');

exports.createList = (listName) => {
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

exports.createDefault = () => {
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
		
		await user.save();
		
		return user;

	} catch (err) {
		throw new Error(err.message);
	}
};

exports.deleteTask = async (userId, listId, itemIndex) => {
	try {
		const user = await userService.findUser(userId);
		user.lists.id(listId).items.splice(itemIndex, 1);
		
		await user.save();

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
		
		await user.save();

		return newList._id;

	} catch (err) {
		throw new Error(err.message);
	}
};

exports.deleteList = async (userId, listId) => {
	try {
		const user = await userService.findUser(userId);
		const index = await this.getListIndex(userId, listId);
		user.lists.splice(index, 1);
		
		await user.save();

		return index;

	} catch (err) {
		throw new Error(err.message);
	}
};

exports.renameList = async (userId, listId, newName) => {
	try {
		const user = await userService.findUser(userId);
		const index = await this.getListIndex(userId, listId);

		user.lists[index].name = newName;
		
		await user.save();

		return listId;

	} catch(err) {
		throw new Error(err.message);
	}
};
