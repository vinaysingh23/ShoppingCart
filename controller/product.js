
const Cart = require('../models/cart');
import {User} from '../models/user';
import {Product} from '../models/product';
import {Order} from '../models/orders';

export const addItem = (req, res) => {

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
    //res.redirect('/');
  }


export const getEdit = (req, res) => {

	let productId = req.params.id;
	console.log(productId);

	Product.find({_id: productId}, (err, product)=> {

		if(err) {
			return res.redirect('/');
		}
		console.log(product);
    
		res.render('items/editProduct', {product: product});
	});


  }


export const postEdit = (req, res) => {

	let productId = req.body.id;
	let conditions = {_id: productId}
		, update = {$inc: {qty: req.body.qty}, $set: {price:req.body.price}}
		, options = {multi: true};

	/*Product.update(
    {"users.name": "johnk"}, //query, you can also query for email
    {$set: {"users.$.name": "JohnKirster"}},
    {"multi": true} //for multiple documents
  ) */   

	Product.update(conditions, update, options, (err, result)=> {
 
		if(err){
			console.log(err);
		}else{
			console.log('success'); 
			res.redirect('/user/profile');   
		}

	});
  
    //res.redirect('/');
  }

export const remove = (req, res) => {

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
  }


 
