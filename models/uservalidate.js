var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Schema1 = new Schema({
	
	email: {type: String, required: true},
	password: {type: String, required: true},

});

/*userSchema.methods.encryptPasword= function(argument) {
	// body...
}*/

var UserValidate = mongoose.model('UserValidate', Schema1)
module.exports = UserValidate;