const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const multer = require('multer');

import {Product} from '../models/product';
import {Order} from '../models/orders';
import * as product from '../controller/product';
import * as shop from '../controller/shop';

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
    callback(null, "./public/images");
  },
  filename: (req, file, callback) => {
    callback(null, file.fieldname + "-" + Date.now());
  },
  onFileUploadStart:  (file) => {
    console.log(file.originalname + ' is starting ...');
  },
  onFileUploadComplete: (file) => {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
  }
});

const upload = multer({storage: storage});

router.get('/items/product',isLoggedIn, (req, res, next)=> {

	res.render('items/product');

});

router.post('/items/product', upload.single('imagePath'), product.addItem);
/*router.post('/items/product', upload.single('imagePath'), (req, res, next)=> {

	let path = req.file ? req.file.path.replace('public', '') : '';
	console.log(req.file);
  
	let newItem = new Product({
		seller_id: req.user._id,
		name: req.body.name,
		description: req.body.description,
		price: req.body.price,
		category: req.body.category,
		qty: req.body.qty,
		imagePath: path
	});
	newItem.save((err)=> {
		if (err)
			return console.error(err);
	});
	console.log('Item created :', req.body.name);
	res.redirect('/items/product');
  
});*/


router.get('/add-to-cart/:id', (req, res, next)=> {

	let productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId, (err, product)=> {
		if(err) {
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		//console.log(req.session.cart);
		res.redirect('/');
	});

});

router.get('/reduceCart/:id', (req, res, next)=> {

	let productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.reduceByOne(productId);
	req.session.cart = cart;
	res.redirect('/shop/mycart');

});


router.get('/removeFromCart/:id', (req, res, next)=> {

	let productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.remove(productId);
	req.session.cart = cart;
	res.redirect('/shop/mycart');

});


router.get('/add_product_by_qty', (req, res, next)=> {

	let productId = req.query.id;
	let qty = req.query.qty;
	let cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.addByQty(productId, qty);
	req.session.cart = cart;
	res.redirect('/shop/mycart');

});


router.get('/items/details/:id', (req, res, next)=> {

	let productId = req.params.id;
	console.log(productId);

	Product.find({_id: productId}, (err, products)=> {
		if(err) {
			return res.redirect('/');
		}
    
		res.render('items/details', {products: products});
	});

});


router.get('/shop/mycart', shop.mycart);
router.get('/shop/checkout', isLoggedIn, shop.checkout);
router.post('/shop/checkout', isLoggedIn, shop.myOrder);

router.get('/items/editProduct/:id', product.getEdit);
router.post('/items/editProduct/:id', product.postEdit);
router.get('/removeProduct/:id', product.remove);
/*router.get('/shop/mycart', (req, res, next)=> {

	if(!req.session.cart){
		return res.render('shop/mycart', {products: null});
	}
	let cart = new Cart(req.session.cart);
	res.render('shop/mycart', { products: cart.generateArr() || {}, totalPrice: cart.totalPrice});


});*/
/*router.get('/shop/checkout', isLoggedIn, (req, res, next)=> {

	if(!req.session.cart){
		return res.render('/shop/mycart');
	}
	let cart = new Cart(req.session.cart);
	res.render('shop/checkout', { products: cart.generateArr(), totalPrice: cart.totalPrice});


});*/


/*router.post('/shop/checkout', isLoggedIn, (req,res,next)=> {

	if(!req.session.cart){
		return res.redirect('/mycart');
	}
	let cart = new Cart(req.session.cart);
 
	let order = new Order({
		user: req.user,
		cart: cart,
		address: req.body.address,
		name: req.body.name,
		cardName: req.body.cardName,
		cardNumber: req.body.cardNumber,
		phoneNumber: req.body.phoneNumber

	});
	req.session.cart= null;
	let new_id = order._id;

	order.save((err, result)=> {

		let newRoomId = result._id;
		console.log(newRoomId);
		req.flash('success', 'successfully bought this product');
   

		Order.find({_id: new_id, user: req.user}, (req, orders)=>{
      
			orders.forEach(function(order){

				cart = new Cart(order.cart);
				order.items = cart.generateArr();
				console.log(order.items);

				order.items.forEach(function(item){

					let conditions = {_id: item.item._id}
						, update = {$inc: {qty: -item.qty}}
						, options = {multi: true};
					Product.update(conditions, update, options, (err, result)=> {
						if(err){
							throw err;
						}else{
							console.log('Success');
						}

					});
				});

			});
    
			//req.redirect('/');
			//req.session.cart= null;

		});
    
		//console.log("______");
    
    
	});

	

	res.redirect('/');

});*/


/*router.get('/items/editProduct/:id', (req, res, next)=> {

	let productId = req.params.id;
	console.log(productId);

	Product.find({_id: productId}, (err, product)=> {

		if(err) {
			return res.redirect('/');
		}
		console.log(product);
    
		res.render('items/editProduct', {product: product});
	});


});
router.post('/items/editProduct/:id', (req, res, next)=> {

	let productId = req.body.id;
	let conditions = {_id: productId}
		, update = {$inc: {qty: req.body.qty}, $set: {price:req.body.price}}
		, options = {multi: true};

	/*Product.update(
    {"users.name": "johnk"}, //query, you can also query for email
    {$set: {"users.$.name": "JohnKirster"}},
    {"multi": true} //for multiple documents
  ) */   

	/*Product.update(conditions, update, options, (err, result)=> {
 
		if(err){
			console.log(err);
		}else{
			console.log('success'); 
			res.redirect('/user/profile');   
		}

	});
  

});*/
/*
router.get('/removeProduct/:id', (req, res, next)=> {

	let productId = req.params.id;
	Product.findOneAndRemove({ _id: productId }, (err, product)=> {

		console.log('success!!!');

	});

	let user = req.user;
	let user_id = user.id;

	Product.find({seller_id: user_id}, (req, products)=>{
		//console.log(products);
		res.render('user/profile', {products: products , type: 'seller' ,userDetails: user});

	});
  
  
});*/


function  isLoggedIn(req,res,next) {

	if(req.isAuthenticated()){
		return next();
	}

	req.session.oldUrl = req.url;
	res.redirect('/user/signin');
  
}
router.get('/', (req,res,next)=> {

	
	Product.find({}, function(err, products){
			if (err) throw err;

			res.render('index', {
				title: 'Shopping Cart',
				products: products
			});
  
			//console.log(products);
		});


});  

router.get('/searchProduct', (req, res, next)=> {

	console.log(req.query.title);

	
		Product.find({name: new RegExp( req.query.title, "i") }, (err, products)=> {

			if(err)
				throw err;

			/*res.render('index', {
				title: 'Shopping cart',
				products: products
			});*/
			console.log(products);
			//res.send(products);
			res.render('result',{products: products});

		});
})

//module.exports = router;
export {router};