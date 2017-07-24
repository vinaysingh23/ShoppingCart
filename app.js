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
var MongoStore = require('connect-mongo')(session);  
/*var multer  = require('multer');
var upload = multer({ dest: 'public/images/' });*/
var multipart = require('connect-multiparty');

var User = require('./models/user.js');
var Product = require('./models/product.js')
var expressValidator = require('express-validator');




var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

app.use( multipart() );

mongoose.connect('mongodb://localhost/shoppingCart'); 
require('./config/passport');
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
app.use(session({
	secret: 'mysupersecret', 
	resave: false, 
	saveUninitialized: false,
	store: new MongoStore({mongooseConnection: mongoose.connection}),
	cookie: { maxAge: 80 * 60 * 1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));


app.use(function(req, res, next){
	res.locals.errors = null;
	res.locals.login = req.isAuthenticated();
	res.locals.session = req.session;
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

app.use('/user', users);
app.use('/', index);


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


module.exports = app;
