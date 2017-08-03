import express from 'express';
const router = express.Router();
import multer from 'multer';

import * as product from '../controller/product';
import * as authorise from '../middlewares/authorise';
import * as imageStorage from '../middlewares/imageStorage';

const upload = multer({storage: imageStorage.storage});

router.get('/items/product', authorise.isLoggedIn, authorise.isSeller, product.getProductPage);
router.post('/items/product', upload.single('imagePath'), product.addItemBySeller);
router.get('/items/details/:id', product.productDetails);

export {router};
