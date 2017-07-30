var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose =require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
//var FormData = require('form-data');
//var fs = require('fs');
var MongoStore = require('connect-mongo')(session);  


//var User = require('./models/user');
var Product = require('./models/product');
var expressValidator = require('express-validator');


//routers
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

mongoose.connect('mongodb://localhost/shoppingCart'); 
require('./config/passport');
 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: 'mysupersecret', 
	resave: false, 
	saveUninitialized: false,
	store: new MongoStore({mongooseConnection: mongoose.connection}),
	cookie: { maxAge: 10 * 60 * 1000}
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
	res.locals.user_type = null;
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

/*Product.find({}, function(err, product) {
  		if (err) throw err;

     	
  		console.log(product);
});
*/

app.get('/', function(req,res,next){

	//console.log(req.body);
	//console.log(req.query.title);

	Product.find({}, function(err, products) {
			if (err) throw err;

			res.render('index', {
				title: 'Shopping Cart',
				products: products
			});
  
			//console.log(products);
		});

	/*if(req.query.title){
		//console.log(req.query.search);
		var name = req.query.title;
		Product.find({name: new RegExp( name, "i") }, function(err, products){

			if(err)
				throw err;

			res.render('index', {
				title: 'Shopping cart',
				products: products
			});
			console.log(products);
			res.send(products);

		});

	}else{

		Product.find({}, function(err, products) {
			if (err) throw err;

			res.render('index', {
				products: products
			});
  
			//console.log(products);
		});
	}*/

});
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;



app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});



module.exports = app;
