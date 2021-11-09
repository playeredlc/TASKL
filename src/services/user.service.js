const User = require('./models/User').model;

exports.findUser = async (userId) => {	
	try {	
		const result = await User.findById(userId);
		
		return result;
		
	} catch (err) {
		throw new Error(err.message);
	}
};

exports.hasList = async (userId) => {
	try {
		const user = await this.findUser(userId);		
		if (!user.lists.length) {
			return false;
		} else {
			return true;
		}		
	} catch (err) {
		throw new Error(err.message);
	}
};

exports.addList = async (userId, listName) => {
	try {
		//const newList = listService.createList(listName);
		const newList = new Array(); // dummy code
		const user = await this.findUser(userId);
		user.lists.push(newList);
		user.save();

		return newList._id;

	} catch (err) {
		throw new Error(err.message);
	}
};

exports.createUser = async (username, password) => {
	try {
		const user = await User.register({ username: username }, password);
		// add default list
		user.save();
		
		return user;

	} catch (err) {
		throw new Error(err.message);
	}

};
