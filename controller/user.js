const Cart = require('../models/cart');
import {User} from '../models/user';
import {Product} from '../models/product';
import {Order} from '../models/orders';



export const profile = (req, res) => {
	const user = req.user;
	
	User.findOne({_id: user}, (req, user) => {
		const type = user.type;
		const user_id = user.id;
	
		if(type === 'user'){
			Order.find({user: user}, (req, orders) => {
				orders.forEach(function(order){
					let cart = new Cart(order.cart);
					order.items = cart.generateArr();
				});
				res.render('user/profile', { orders: orders, type: type, userDetails: user});
			});
		}else{
			Product.find({seller_id: user_id}, (req, products) => {
				res.render('user/profile', {products , type ,userDetails: user});
			});
		}
	});
};

export const logout = (req, res) => {
	req.logout();
	req.session.cart = null;
	req.session.oldUrl = null;
	res.redirect('/');
};

export const getSignup = (req, res) => {
	const messages = req.flash('error');
	res.render('user/signup', {csrfToken: req.csrfToken(), messages, hasErrors: messages.length >0});
};

export const postSignup = (req, res) => {
	if(req.session.oldUrl){
		const old = req.session.oldUrl;
		req.session.oldUrl = null;
		res.redirect(old);
	}else{
		res.redirect('/');
	}
};

export const getSignin = (req, res) => {
	const messages = req.flash('error');
	res.render('user/signin', {csrfToken: req.csrfToken(), messages, hasErrors: messages.length > 0});
};

export const postSignin = (req, res) => {
	if(req.session.oldUrl){
		const old = req.session.oldUrl;
		req.session.oldUrl = null;
		res.redirect(old);
	}else{
		res.redirect('/');
	}
};
