const findOrCreate = require('mongoose-findorcreate');
const User = require('../models/User').model;
const listService = require('./list.service');

exports.findUser = async (userId) => {	
	try {	
		const user = await User.findById(userId);
		
		return user;
		
	} catch (err) {
		throw new Error(err.message);
	}
};

exports.findByUserame = async (username) => {
	try {
		const user = await User.findOne({ username: username });

		return user;

	} catch (err) {
		throw new Error(err.message);
	}
}

exports.findOrCreate = async (googleId, cb) => {
	try {
		const user = await User.findOrCreate(
			{ googleId: googleId },
			{ lists: listService.createDefault() },
			(err, user) => { return cb(err, user); }
		);
	} catch (err) {
		throw new Error(err.message);
	}

}

exports.createUser = async (username, password) => {
	try {
		const user = await User.register({ username: username }, password);
		const defaultList = listService.createDefault();
		user.lists.push(defaultList);
		user.save();
		
		return user;
		
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
