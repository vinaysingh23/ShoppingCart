var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({

	name: {type: String},
	description: {type: String},
	price: {type: Number},
	category: String,
	qty: {type: Number},
	//imagePath: { data: Buffer, contentType: String },
	imagePath: String
	/*path: {
		 type: String,
		 required: true,
		 trim: true
	 },
	originalname: {
		 type: String,
		 required: true
	 }*/
});
var Product = mongoose.model('Product', schema);
module.exports = Product;

