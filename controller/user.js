const passport= require('passport');
const Cart = require('../models/cart');
import {User} from '../models/user';
import {Product} from '../models/product';
import {Order} from '../models/orders';



export const profile = (req, res) => {
 let user = req.user;
	
	User.findOne({_id: user}, (req, next)=> {

		let type = user.type;
		let user_id = user.id;
	
		if(type === 'user'){

			Order.find({user: user}, (req, orders)=>{
			
				orders.forEach(function(order){

					let cart = new Cart(order.cart);
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
};

