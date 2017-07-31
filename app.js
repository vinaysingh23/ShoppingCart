const express = require('express');
const path = require('path');
//const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose =require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);  
const expressValidator = require('express-validator');

import {Product} from './models/product';



import { router as index } from './routes/index';
import { router as users } from './routes/users';

const app = express();

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


app.use((req, res, next)=> {

	res.locals.errors = null;
	res.locals.login = req.isAuthenticated();
	res.locals.session = req.session;
	res.locals.user_type = null;
	next();

});

//Expree validator
app.use(expressValidator({

	errorFormatter: (param, msg, value)=> {

		let namespace = param.split('.')
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

//app.use('/user', users);
//app.use('/', index);
app.use(index);
app.use(users);





app.listen(3000);


