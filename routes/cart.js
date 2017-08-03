import express from 'express';
const router = express.Router();

import * as cart from '../controller/cart';


//Cart router
router.get('/cart/add-to-cart/:id', cart.addToCart);
router.get('/cart/reduceCart/:id', cart.reduceCartItemByOne);
router.get('/cart/removeFromCart/:id', cart.removeFromCart);
router.get('/cart/add_product_by_qty', cart.incByQty);

export {router};