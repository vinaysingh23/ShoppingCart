const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Schema1 = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	cart: {type: Object },
	address: {type:String },
	name: {type: String},
	cardName:String,
	cardNumber: String,
	phoneNumber: String
	

});


let Order = mongoose.model('Order', Schema1);

export {Order};