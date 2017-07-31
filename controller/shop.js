
const Cart = require('../models/cart');
import {User} from '../models/user';
import {Product} from '../models/product';
import {Order} from '../models/orders';

export const myOrder = (req, res) => {

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

				let cart = new Cart(order.cart);
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
   

		});
    
    
	});

	

	res.redirect('/');
  }


export const mycart = (req, res) => {
	
	if(!req.session.cart){
		return res.render('shop/mycart', {products: null});
	}
	let cart = new Cart(req.session.cart);
	res.render('shop/mycart', { products: cart.generateArr() || {}, totalPrice: cart.totalPrice});
};

export const checkout = (req, res) => {
	
	if(!req.session.cart){
		return res.render('/shop/mycart');
	}
	let cart = new Cart(req.session.cart);
	res.render('shop/checkout', { products: cart.generateArr(), totalPrice: cart.totalPrice});
};