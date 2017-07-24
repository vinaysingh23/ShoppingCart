var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Schema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	cart: {type: Object },
	address: {type:String },
	name: {type: String},
	cardName:String,
	cardNumber: String,
	phoneNumber: String
	

});


var Order = mongoose.model('Order', Schema)
module.exports = Order;