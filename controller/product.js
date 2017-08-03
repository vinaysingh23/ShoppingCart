
import {User} from '../models/user';
import {Product} from '../models/product';
import {Order} from '../models/orders';

export const getProductPage = (req, res) => {
	res.render('items/product');
};

export const addItemBySeller = (req, res) => {
	const path = req.file ? req.file.path.replace('public', '') : '';
  
	const newItem = new Product({
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
	res.redirect('/items/product');
};


export const searchProduct = (req, res) => {
	Product.find({name: new RegExp( req.query.search, 'i') }, (err, products) => {
		if(err)
			throw err;
	
		res.render('index',{products, cartQty : req.session.cart ? req.session.cart.totalQty : 0});
	});
};

export const getAllProduct = (req, res) => {
	Product.find({}, function(err, products){
		if (err) throw err;

		res.render('index', {
			title: 'Shopping Cart',
			products: products,
			cartQty : req.session.cart ? req.session.cart.totalQty : 0
		});
	});
};

export const productDetails = (req, res) => {
	const productId = req.params.id;

	Product.find({_id: productId}, (err, products) => {
		if(err) {
			return res.redirect('/');
		}
		res.render('items/details', {products, cartQty : req.session.cart ? req.session.cart.totalQty : 0});
	});
};








 
