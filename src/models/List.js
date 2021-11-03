const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
	name: String,
	items: Array
});

const List = new mongoose.model('List', listSchema);

module.exports = {
    schema: listSchema,
    model: List,
};
