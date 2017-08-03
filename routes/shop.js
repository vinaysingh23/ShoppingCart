import express from 'express';
const router = express.Router();

import * as shop from '../controller/shop';

import * as authorise from '../middlewares/authorise';


router.get('/shop/mycart', shop.mycart);
router.get('/shop/checkout', authorise.isLoggedIn, shop.checkout);
router.post('/shop/checkout', authorise.isLoggedIn, shop.myOrder);



export {router};