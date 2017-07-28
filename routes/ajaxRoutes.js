var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Order = require('../models/orders');
var Cart = require('../models/cart');
var multer = require('multer');
