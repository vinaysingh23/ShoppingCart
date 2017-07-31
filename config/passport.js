var passport = require('passport');
import {User} from '../models/user';
var LocalStategy = require('passport-local').Strategy;

passport.serializeUser((user, done)=> {

	done(null,user.id);
	
});

passport.deserializeUser((id, done)=> {

	User.findById(id, (err, user)=> {
		done(err, user);
	});
});

passport.use('local.signup', new LocalStategy({

	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true

}, (req, email, password, done)=> {

	req.checkBody('name', 'empty name').notEmpty();
	req.checkBody('email', 'Invalid email or empty email').notEmpty().isEmail();
	req.checkBody('password', 'empty password').notEmpty();
	req.checkBody('type', 'empty type').notEmpty();
	req.checkBody('confirm_password', 'confirm password required').notEmpty().equals(req.body.password);
    
	console.log(req.body);
	var errors = req.validationErrors();
	if(errors) {
		var messages = [];
		errors.forEach((error)=> {
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}

	User.findOne({'email': email}, (err, user)=> {

		if(err){

			return done(err);

		}
		if(user){

			return done(null, false, {message: 'Email already exist'});
			
		}

		var newUser = new User();
		newUser.email = email;
		newUser.password = password;
		newUser.name = req.body.name;
		newUser.type = req.body.type;
		newUser.cart = {},

		newUser.save((err, result)=> {

			if(err){
				done(err);
			}

			return done(null, newUser);
			
		});
	});

}));

passport.use('local.signin', new LocalStategy( {

	usernameField: 'email',
	passwordfield: 'password',
	passReqToCallback: true

}, (req, email, password, done)=> {

	req.checkBody('email', 'Invalid email').notEmpty().isEmail();
	req.checkBody('password', 'Invalid password').notEmpty();

	var errors = req.validationErrors();

	if(errors) {
		
		var messages = [];
		errors.forEach(function(error) {

			messages.push(error.msg);

		});

		return done(null, false, req.flash('error', messages));
	}

	User.findOne({'email': email}, (err, user)=> {
		

		if(err){
			return done(err);
		}

		if(!user){
			return done(null, false, {message: 'No user found'});
		}

		if(user.password != password){
			return done(null, false, {message: 'Wrong password'});
		}
		

		return done(null,user);

	
	});
}));