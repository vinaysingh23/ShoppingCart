import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const schema1 = new Schema({
	seller_id: {type: String},
	name: {type: String},
	description: {type: String},
	price: {type: Number},
	category: String,
	qty: {type: Number},
	imagePath: String
});
	
let Product = mongoose.model('Product', schema1);

export {Product};

