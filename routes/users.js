import express from 'express';
const router = express.Router();
import passport from 'passport';
import csrf from 'csurf';

import * as user from '../controller/user';
import * as authorise from '../middlewares/authorise';

const csrfProtection = csrf();
router.use(csrfProtection);

router.get('/user/profile', authorise.isLoggedIn, user.profile);

router.get('/user/logout', authorise.isLoggedIn, user.logout);

router.use('/', authorise.notLoggedIn, (req,res,next)=>{
	next();
});

router.get('/user/signup', user.getSignup);

router.post('/user/signup', passport.authenticate('local.signup', {
	failureRedirect: '/user/signup',
	failureFlash: true 
}), user.postSignup);

router.get('/user/signin', user.getSignin);

router.post('/user/signin', passport.authenticate('local.signin',  {
	failureRedirect: '/user/signin',
	failureFlash: true
}), user.postSignin);


export {router};