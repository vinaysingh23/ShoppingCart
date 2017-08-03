const Cart = require('../models/cart');
import {User} from '../models/user';
import {Product} from '../models/product';
import {Order} from '../models/orders';



export const getEditProduct = (req, res) => {
	const productId = req.params.id;

	Product.find({_id: productId}, (err, product)=> {
		if(err) {
			return res.redirect('/');
		}

		res.render('items/editProduct', {product});
	});
};

export const postEditProduct = (req, res) => {
	const productId = req.body.id;
	const conditions = {_id: productId}
		, update = {$inc: {qty: req.body.qty}, $set: {price:req.body.price}}
		, options = {multi: true};

	/*Product.update(
    {"users.name": "johnk"}, //query, you can also query for email
    {$set: {"users.$.name": "JohnKirster"}},
    {"multi": true} //for multiple documents
  ) */   

	Product.update(conditions, update, options, (err, result)=> {
		if(err){
			return console.log(err);
		}else{
			res.redirect('/user/profile');   
		}
	});
};

export const removeProduct = (req, res) => {
	const productId = req.params.id;
	Product.findOneAndRemove({ _id: productId }, (err, product)=> {
		if(err){
			throw err;
		}
	});

	const user = req.user;
	const user_id = user.id;

	Product.find({seller_id: user_id}, (req, products)=>{
		res.render('user/profile', {products, type: 'seller' , userDetails: user});
	});
};