const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');
const listSchema = require('./List').schema;

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	googleId: String,
	lists: [listSchema]
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

module.exports = {
	schema: userSchema,
	model: User,
};
