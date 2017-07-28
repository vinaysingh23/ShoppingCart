var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema1 = new Schema({
	seller_id: {type: String},
	name: {type: String},
	description: {type: String},
	price: {type: Number},
	category: String,
	qty: {type: Number},
	imagePath: String
});
	
var Product = mongoose.model('Product', schema1);
module.exports = Product;

