var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Order = require('../models/orders');
var Cart = require('../models/cart');
var multer = require('multer');


var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, 'public/images');
	},
	filename: function(req, file, callback){
		callback(null, file.fieldname + '-' + Date.now());
	},
	onFileUploadStart:  function(file){
		console.log(file.originalname + ' is starting ...');
	},
	onFileUploadComplete: function(file) {
		console.log(file.fieldname + ' uploaded to  ' + file.path);
	}
});
var upload = multer({storage: storage});

router.get('/items/product',isLoggedIn, function(req, res, next){
	res.render('items/product');
});
router.post('/items/product', upload.single('imagePath'), function(req, res, next){
	var path = req.file ? req.file.path.replace('public', '') : '';
	console.log(req.file);
  
	var newItem = new Product({
		seller_id: req.user._id,
		name: req.body.name,
		description: req.body.description,
		price: req.body.price,
		category: req.body.category,
		qty: req.body.qty,
		imagePath: path
	});
	newItem.save(function(err) {
		if (err)
			return console.error(err);
	});
	console.log('Item created :', req.body.name);
	res.redirect('/items/product');
  
});


router.get('/add-to-cart/:id', function(req, res, next){
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId, function(err, product){
		if(err) {
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		//console.log(req.session.cart);
		res.redirect('/');
	});

});

router.get('/reduceCart/:id', function(req, res, next){
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.reduceByOne(productId);
	req.session.cart = cart;
	res.redirect('/shop/mycart');
});


router.get('/removeFromCart/:id', function(req, res, next){
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.remove(productId);
	req.session.cart = cart;
	res.redirect('/shop/mycart');
});


router.get('/add_product_by_qty', function(req, res, next){
	var productId = req.query.id;
	var qty = req.query.qty;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.addByQty(productId, qty);
	req.session.cart = cart;
	res.redirect('/shop/mycart');
});


router.get('/items/details/:id', function(req, res, next){
	var productId = req.params.id;
	console.log(productId);

	Product.find({_id: productId}, function(err, products){
		if(err) {
			return res.redirect('/');
		}
    
		res.render('items/details', {products: products});
	});

});


router.get('/shop/mycart', function(req, res, next){
	if(!req.session.cart){
		return res.render('shop/mycart', {products: null});
	}
	var cart = new Cart(req.session.cart);
	res.render('shop/mycart', { products: cart.generateArr() || {}, totalPrice: cart.totalPrice});


});
router.get('/shop/checkout', isLoggedIn, function(req, res, next){
	if(!req.session.cart){
		return res.render('/shop/mycart');
	}
	var cart = new Cart(req.session.cart);
	res.render('shop/checkout', { products: cart.generateArr(), totalPrice: cart.totalPrice});


});

router.post('/shop/checkout', isLoggedIn, function(req,res,next) {
	if(!req.session.cart){
		return res.redirect('/mycart');
	}
	var cart = new Cart(req.session.cart);
 
	var order = new Order({
		user: req.user,
		cart: cart,
		address: req.body.address,
		name: req.body.name,
		cardName: req.body.cardName,
		cardNumber: req.body.cardNumber,
		phoneNumber: req.body.phoneNumber

	});
	req.session.cart= null;
	var new_id = order._id;

	order.save(function(err, result){
		var newRoomId = result._id;
		console.log(newRoomId);
		req.flash('success', 'successfully bought this product');
   

		Order.find({_id: new_id, user: req.user}, function(req, orders){
      
			orders.forEach(function(order){
				cart = new Cart(order.cart);
				order.items = cart.generateArr();
				console.log(order.items);

				order.items.forEach(function(item){

					var conditions = {_id: item.item._id}
						, update = {$inc: {qty: -item.qty}}
						, options = {multi: true};
					Product.update(conditions, update, options, function(err, result){
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

});


router.get('/items/editProduct/:id', function(req, res, next){

	var productId = req.params.id;
	console.log(productId);

	Product.find({_id: productId}, function(err, product){
		if(err) {
			return res.redirect('/');
		}
		console.log(product);
    
		res.render('items/editProduct', {product: product});
	});


});
router.post('/items/editProduct/:id', function(req, res, next){

	var productId = req.body.id;
	var conditions = {_id: productId}
		, update = {$inc: {qty: req.body.qty}, $set: {price:req.body.price}}
		, options = {multi: true};

	/*Product.update(
    {"users.name": "johnk"}, //query, you can also query for email
    {$set: {"users.$.name": "JohnKirster"}},
    {"multi": true} //for multiple documents
  ) */   

	Product.update(conditions, update, options, function(err, result){
 
		if(err){
			console.log(err);
		}else{
			console.log('success'); 
			res.redirect('/user/profile');   
		}

	});
  

});

router.get('/removeProduct/:id', function(req, res, next){

	var productId = req.params.id;
	Product.findOneAndRemove({ _id: productId }, function(err, product){
		console.log('success!!!');

	});

	var user = req.user;
	var user_id = user.id;

	Product.find({seller_id: user_id}, function(req, products){
		console.log(products);
		res.render('user/profile', {products: products , type: 'seller' ,userDetails: user});

	});
  
  
});


function  isLoggedIn(req,res,next) {
	if(req.isAuthenticated()){
		return next();
	}

	req.session.oldUrl = req.url;
	res.redirect('/user/signin');
  
}
router.get('/searchProduct', function(req, res, next){
	console.log(req.query.title);

	
		Product.find({name: new RegExp( req.query.title, "i") }, function(err, products){

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

module.exports = router;