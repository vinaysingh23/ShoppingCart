var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	name: {type: String, required: true},
	type: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
	confirm_password: {type: String, required: false},

});

/*userSchema.methods.encryptPasword= function(argument) {
	// body...
}*/

var User = mongoose.model('User', userSchema)
module.exports = User;