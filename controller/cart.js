const Cart = require('../models/cart');
import {User} from '../models/user';
import {Product} from '../models/product';
import {Order} from '../models/orders';



export const addToCart = (req, res) => {
	const productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId, (err, product)=> {
		if(err) {
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		res.redirect('/');
	});
};

export const reduceCartItemByOne = (req, res) => {
	const productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart : {});
	cart.reduceByOne(productId);
	req.session.cart = cart;
	res.redirect('/shop/mycart');
};

export const removeFromCart = (req, res) => {
	const productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart : {});
	cart.remove(productId);
	req.session.cart = cart;
	res.redirect('/shop/mycart');
};

export const incByQty = (req, res) => {
	const productId = req.query.id;
	const qty = req.query.qty;
	let cart = new Cart(req.session.cart ? req.session.cart : {});
	cart.addByQty(productId, qty);
	req.session.cart = cart;
	res.redirect('/shop/mycart');
};