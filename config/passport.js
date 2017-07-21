var passport = require('passport');
var User = require('../models/user');
var LocalStategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
	done(null,user.id);
	// body...
});

passport.deserializeUser(function(id, done){
   User.findById(id, function(err, user){
   	done(err, user);
   });
});

passport.use('local.signup', new LocalStategy({
	usernameField: 'email',
	passwordfield: 'password',
	passReqToCallback; true
}, function(req, email, password, done){
	User.findOne({'email'; email},function(err, user){
		if(err){
			return done(err);
		}
		if(user){
			return done(null,false, (message: 'Email exist'));
		}

		var newUser = new User();
		newUser.email = email;
		newUser.password = password;
	});

}));