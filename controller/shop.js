const Cart = require('../models/cart');
import {User} from '../models/user';
import {Product} from '../models/product';
import {Order} from '../models/orders';

export const myOrder = (req, res) => {
	if(!req.session.cart){
		return res.redirect('/mycart');
	}
	let cart = new Cart(req.session.cart);
 
	const order = new Order({
		user: req.user,
		cart: cart,
		address: req.body.address,
		name: req.body.name,
		cardName: req.body.cardName,
		cardNumber: req.body.cardNumber,
		phoneNumber: req.body.phoneNumber

	});
	req.session.cart= null;
	const new_id = order._id;

	order.save((err, result) => {
		req.flash('success', 'successfully bought this product');

		Order.find({_id: new_id, user: req.user}, (req, orders) => {
			orders.forEach((order) => {
				const cart = new Cart(order.cart);
				order.items = cart.generateArr();

				order.items.forEach((item) => {
					const conditions = {_id: item.item._id}
						, update = {$inc: {qty: -item.qty}}
						, options = {multi: true};
					Product.update(conditions, update, options, (err, result) => {
						if(err){
							throw err;
						}
					});
				});
			});
		});      
	});
	res.redirect('/');
};


export const mycart = (req, res) => {
	if(!req.session.cart){
		return res.render('shop/mycart', {products: null});
	}
	const cart = new Cart(req.session.cart);
	res.render('shop/mycart', { products: cart.generateArr() || {}, totalPrice: cart.totalPrice});
};

export const checkout = (req, res) => {
	if(!req.session.cart){
		return res.render('shop/mycart');
	}
	const cart = new Cart(req.session.cart);
	res.render('shop/checkout', { products: cart.generateArr(), totalPrice: cart.totalPrice});
};