var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
	name: {type: String },
	type: {type: String },
	email: {type: String },
	password: {type: String },
	cart: {type: Object}
	

});

userSchema.methods.encryptPassword = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
	// body...
};


var User = mongoose.model('User', userSchema)
module.exports = User;