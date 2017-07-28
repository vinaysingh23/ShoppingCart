var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Schema1 = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	cart: {type: Object },
	address: {type:String },
	name: {type: String},
	cardName:String,
	cardNumber: String,
	phoneNumber: String
	

});


var Order = mongoose.model('Order', Schema1);
module.exports = Order;