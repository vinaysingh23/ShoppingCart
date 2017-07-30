var express = require('express');
var router = express.Router();
var passport= require('passport');
var Order = require('../models/orders');
var User = require('../models/user');
var Cart = require('../models/cart');
var Product = require('../models/product');
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function(req, res, next) {

	var user = req.user;


	console.log(user);
	User.findOne({_id: user}, function(req, next){
	var type = user.type;
	var user_id = user.id;
	
	if(type === 'user'){

		Order.find({user: user}, function(req, orders){
			
			orders.forEach(function(order){
				cart = new Cart(order.cart);
				order.items = cart.generateArr();

			});
			console.log(orders);
			//console.log(user);
			res.render('user/profile', { orders: orders, type: type, userDetails: user});

		});
	}else{
		Product.find({seller_id: user_id}, function(req, products){
			console.log(products);
			res.render('user/profile', {products: products , type: type ,userDetails: user})
		});
	}

	});
	

  // body...
});
router.get('/logout', isLoggedIn, function (req,res,next) {
	req.logout();
	res.redirect('/');
	// body...
});

router.use('/', notLoggedIn, function(req, res, next){
	next();
} );
/* GET users listing. */

router.get('/signup', function(req, res, next){
  var messages = req.flash('error');
	res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length >0});
});

router.post('/signup', passport.authenticate('local.signup', {
	failureRedirect: '/user/signup',
	failureFlash: true
}), function(req, res){
	if(req.session.oldUrl){
		var old = req.session.oldUrl;
		req.session.oldUrl = null;
		res.redirect(old);
		

	}else{
		res.redirect('user/profile');
	}
});

router.get('/signin', function(req, res, next){
	var messages = req.flash('error');
	res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin',  {
	failureRedirect: '/user/signin ',
	failureFlash: true
}), function(req, res){
	if(req.session.oldUrl){
		res.redirect(req.session.oldUrl);
		req.session.oldUrl = null;

	}else{
		res.redirect('user/profile');
	}
});



module.exports = router;

function  isLoggedIn(req,res,next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
	// body...
}
function  notLoggedIn(req,res,next) {
	if(!req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
	// body...
}