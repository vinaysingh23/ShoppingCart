import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';

const mongoStore = require('connect-mongo')(session);

import expressValidator from 'express-validator';
import passportConfig from './config/passport';
import dbConfig from './config/dbConfig';

// Routers
import { router as home } from './routes/home';
import { router as users } from './routes/users';
import { router as admin } from './routes/admin';
import { router as seller } from './routes/seller';
import { router as items } from './routes/items';
import { router as shop } from './routes/shop';
import { router as cart } from './routes/cart';

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());


app.use(session({
	secret: 'mysupersecret',
	resave: false,
	saveUninitialized: false,
	store: new mongoStore({ mongooseConnection: mongoose.connection }),
	cookie: { maxAge: 80 * 60 * 1000 },
}));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(`${__dirname}/public`));


// global variables
app.use((req, res, next) => {
	res.locals.errors = null;
	res.locals.login = req.isAuthenticated();
	res.locals.session = req.session;
	next();
});


app.use(home);
app.use(admin);
app.use(seller);
app.use(items);
app.use(shop);
app.use(cart);
app.use(users);


app.listen(3000);

