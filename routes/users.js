const express = require('express');
const router = express.Router();
const passport= require('passport');
const Cart = require('../models/cart');
const csrf = require('csurf');
import {Product} from '../models/product';
import {Order} from '../models/orders';
import {User} from '../models/user';

const csrfProtection = csrf();
router.use(csrfProtection);

router.get('/user/profile', isLoggedIn, (req, res, next)=> {

	let user = req.user;
	
	User.findOne({_id: user}, (req, next)=> {

		let type = user.type;
		let user_id = user.id;
	
		if(type === 'user'){

			Order.find({user: user}, (req, orders)=>{
			
				orders.forEach(function(order){

					cart = new Cart(order.cart);
					order.items = cart.generateArr();

				});
				//console.log(orders);
				res.render('user/profile', { orders: orders, type: type, userDetails: user});

			});
		}else{

			Product.find({seller_id: user_id}, (req, products)=> {

				//console.log(products);
				res.render('user/profile', {products: products , type: type ,userDetails: user});

			});
		}

	});
	


});
router.get('/user/logout', isLoggedIn, (req,res,next)=> {

	req.logout();
	res.redirect('/');
	
});

router.use('/', notLoggedIn, (req, res, next)=>{
	next();
} );


router.get('/user/signup', (req, res, next)=>{

  let messages = req.flash('error');
	res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length >0});

});

router.post('/user/signup', passport.authenticate('local.signup', {

	failureRedirect: '/user/signup',
	failureFlash: true 

}), (req, res)=>{

	if(req.session.oldUrl){

		let old = req.session.oldUrl;
		req.session.oldUrl = null;
		res.redirect(old);
		
	}else{

		res.redirect('/');

	}
});

router.get('/user/signin', (req, res, next)=>{

	let messages = req.flash('error');
	res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});

});

router.post('/user/signin', passport.authenticate('local.signin',  {

	failureRedirect: '/user/signin',
	failureFlash: true

}), (req, res)=> {

	if(req.session.oldUrl){

		res.redirect(req.session.oldUrl);
		req.session.oldUrl = null;

	}else{

		res.redirect('/');

	}
});


function  isLoggedIn(req,res,next) {

	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/');

}
function  notLoggedIn(req,res,next) {

	if(!req.isAuthenticated()){
		return next();
	}

	res.redirect('/');

}

export {router};