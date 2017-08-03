const Cart = require('../models/cart');
import {User} from '../models/user';
import {Product} from '../models/product';
import {Order} from '../models/orders';

export const getAllUser = (req, res) => {
	User.find({}, (err, users) => {
		if(err){
			throw err;
		}else{
			res.render('admin/admin', {users});	
		}
	});	
};

export const userOrderDetails = (req, res) => {
	const id = req.params.id;
	User.find({_id: id}, (err, user) => {
		Order.find({user: user}, (err, orders) => {
			orders.forEach(function(order){
				let cart = new Cart(order.cart);
				order.items = cart.generateArr();
			});
			
			res.render('admin/userDetails', {orders, type: 'user', id});
		});
	});
};

export const sellerProductDetails = (req, res) => {
	const id = req.params.id;
	Product.find({seller_id: id}, (err, products) => {
		if(err) {
			throw err;
		}else{
			res.render('admin/userDetails', {products, type: 'seller', id})
		}
	});
};

export const getEditProduct = (req, res) => {
	const productId = req.params.id;
	Product.find({_id: productId}, (err, product) => {
		if(err) {
			return res.redirect('/');
		}
	
		res.render('admin/editProduct', {product});
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

	Product.update(conditions, update, options, (err, result) => {
		if(err){
			return console.log(err);
		}else{
			res.redirect('/');   
		}
	});
};

export const removeProduct = (req, res) => {
	const productId = req.params.id;
	Product.findOneAndRemove({ _id: productId }, (err, product) => {
		if(err){
			throw err;
		}
	});
	
	res.redirect('/');
};

export const removeOrder = (req, res) => {
	const orderId = req.params.id;
	Order.findOneAndRemove({ _id: orderId }, (err, order) => {
		if(err){
			throw err;
		}
	});
	
	res.redirect('/');
};