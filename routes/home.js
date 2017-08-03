import express from 'express';
const router = express.Router();

import * as product from '../controller/product';


router.get('/', product.getAllProduct);
router.get('/searchProduct', product.searchProduct);


export {router};