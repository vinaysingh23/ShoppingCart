import express from 'express';
const router = express.Router();


import * as seller from '../controller/seller';


router.get('/seller/items/editProduct/:id', seller.getEditProduct);
router.post('/seller/items/editProduct/:id', seller.postEditProduct);
router.get('/seller/removeProduct/:id', seller.removeProduct);


export {router};