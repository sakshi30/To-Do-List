var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

const TaskSchema = new Schema({
	token: {
		type: String,
		required: true
	},
	new_date: {
		type: String,
		required: true
	},
	task: {
		type: String,
		required: true
	}, 
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
})

module.exports = mongoose.model('Task', TaskSchema);