var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose =require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var FormData = require('form-data');
var fs = require('fs');
/*var multer  = require('multer');
var upload = multer({ dest: 'public/images/' });*/
var multipart = require('connect-multiparty');

var User = require('./models/user.js');
var UserValidate = require('./models/uservalidate');
var Product = require('./models/product.js')
var expressValidator = require('express-validator');




var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use( multipart() );

mongoose.connect('mongodb://localhost/shoppingCart'); 
  //useMongoClient: true,
  // other options *

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'mysupersecret', resave: false,  saveUninitialized: false}));
app.use(flash());
/*app.use(passport.initialize());
app.use(passport.session());*/
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));


app.use(function(req, res, next){
	res.locals.errors = null;
	next();

});
//Expree validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use('/', index);
app.use('/users', users);
/*app.get('/user/signin', function(req, res, next){
	res.render('user/signin');
	next();

});*/

Product.find({}, function(err, product) {
  		if (err) throw err;

     	
  
  		console.log(product);
	});
app.get('/', function(req,res,next){

	Product.find({}, function(err, product) {
  		if (err) throw err;

     	res.render('index', {
	     	 title: 'Shopping Cart',
	     	 products: product
     	  });
  
  		//console.log(product);
	});

})
app.post('/items/product', function(req, res, next){

	req.checkBody('name', 'name is Required').notEmpty();
	req.checkBody('description', 'description is Required').notEmpty();
	req.checkBody('price', 'price is Required').notEmpty();
	//req.checkBody('imagePath', 'image is Required').notEmpty();
	
     
	var errors = req.validationErrors();
	console.log(errors);
	if(errors){
		res.render('items/product', {
		
			errors: errors  
		});
		
	}else {

		console.log(req.files.imagePath.originalFilename);
		console.log(req.body);
		/*var a = new Product();
		a.name= req.body.name;
		a.description= req.body.description;
		a.price= req.body.price;
		a.imagePath.data = fs.readFileSync((req.files.imagePath.data).toString());
		//console.log(a.imagePath.data);
        a.imagePath.contentType = 'image/jpeg';*/
    



		/*a.save(function(err, result) {
  			if (err){
  				console.log(err);
  			}

  			console.log('Product saved successfully!');
  			res.send('success');

		});*/
		
	}


	//console.log(newUser);
});


app.post('/user/signup', function(req, res, next){
//console.log("idjfk");
	req.checkBody('name', ' Name is Required').notEmpty();
	req.checkBody('type', 'Type is Required').notEmpty();
	req.checkBody('email', 'Email is Required').notEmpty();
	req.checkBody('password', 'password is Required').notEmpty();
	req.checkBody('confirm_password', 'Confirm Password is Required').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('user/signup', {
		
			errors: errors  
		});
		
	}else {
		var newUser = new User({
			name: req.body.name,
			type: req.body.type,
			email: req.body.email,
			password: req.body.password
		});
		console.log(newUser);

		newUser.save(function(err, result) {
  			if (err){
  				console.log(err);
  			}

  			console.log('User saved successfully!');
  			res.send('success');

		});
		
	}


	//console.log(newUser);
});


app.post('/user/signin', function(req, res){

	req.checkBody('email', 'Email is Required').notEmpty();
	req.checkBody('password', 'password is Required').notEmpty();
	

	var errors = req.validationErrors();

	if(errors){
		res.render('user/signin', {
		
			//users: users,
			errors: errors  
		});
		//console.log("ERROR");

	}else {
		
			/*var emailid= req.body.email,
			var passworda= req.body.password*/
	
		console.log("SUCESS");
		
  			res.redirect('/');

		

	}

	//console.log(newUser);
});

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/
// error handler
/*app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

module.exports = app;
