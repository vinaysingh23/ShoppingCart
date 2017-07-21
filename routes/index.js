var express = require('express');
var router = express.Router();
var Product = require('../models/product')
var multer = require('multer');
var upload = multer({ dest: './public/images/' });
var storage = multer.diskStorage({
  destination: function(req, file, callback){
  	console.log(__dirname);
    callback(null, "./public/images");
  },
  filename: function(req, file, callback){
    callback(null, file.fieldname + "-" + Date.now());
  }
});
//var upload = multer({storage: storage});

//router.post('/items/product',  upload.single('image'), admin.addItem);
router.post('/items/product',upload.any() ,function(req, res, next){
	//var path = req.file ? req.file.path.replace('public', '') : '';
    console.log(req.body, req.file);
  
    var newItem = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      quantity: req.body.quantity,
      //imagePath: path
    });
    newItem.save(function(err) {
      if (err)
        return console.error(err);
    });
    console.log('Item created :', req.body.name);
    res.redirect('/');
  
});
/*var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);*/

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shopping Cart' });
});*/

router.get('/user/signup', function(req, res, next){
	res.render('user/signup');
});

router.post('user/signup', function(req, res, next){
	res.redirect('/');
});
router.get('user/signin', function(req, res, next){
	res.redirect('/');
});
router.get('/items/product', function(req, res, next){
	res.render('items/product');
});
/*router.post('/items/product', upload.any(), function(req, res, next){
	res.send(req.files);
	res.send(req.body);
});*/
module.exports = router;
