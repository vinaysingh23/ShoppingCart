const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
	name: {type: String },
	type: {type: String },
	email: {type: String },
	password: {type: String },
	cart: {type: Object}
	

});

/*userSchema.methods.encryptPassword = (password)=> {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}
userSchema.methods.validPassword = (password)=>  {
	return bcrypt.compareSync(passwor, this.password);*/

let User = mongoose.model('User', userSchema);
export {User};