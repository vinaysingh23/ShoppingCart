import express from 'express';
const router = express.Router();

import * as admin from '../controller/admin';
import * as authorise from '../middlewares/authorise';


router.get('/admin', authorise.isLoggedIn, authorise.isAdmin, admin.getAllUser);


router.get('/admin/sellerDetails/:id', admin.sellerProductDetails);
router.get('/admin/userDetails/:id', admin.userOrderDetails);
router.get('/admin/editProduct/:id', admin.getEditProduct);
router.post('/admin/editProduct/:id', admin.postEditProduct);
router.get('/admin/RemoveProduct/:id', admin.removeProduct);
router.get('/admin/RemoveOrder/:id', admin.removeOrder);



export {router};