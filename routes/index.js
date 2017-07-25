var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Order = require('../models/orders');
var Cart = require('../models/cart');
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
router.get('/items/product',isLoggedIn, function(req, res, next){
  res.render('items/product');
});
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


router.get('/add-to-cart/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function(err, product){
    if(err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });

});
router.get('/items/details/:id', function(req, res, next){
  var productId = req.params.id;
  console.log(productId);

  Product.find({_id: productId}, function(err, products){
    if(err) {
      return res.redirect('/');
    }
    
    res.render('items/details', {products: products});
  });

});
router.get('/shop/mycart', function(req, res, next){
  if(!req.session.cart){
    return res.render('shop/mycart');
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/mycart', { products: cart.generateArr(), totalPrice: cart.totalPrice});


});
router.get('/shop/checkout', isLoggedIn, function(req, res, next){
  if(!req.session.cart){
    return res.render('/shop/mycart');
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/checkout', { products: cart.generateArr(), totalPrice: cart.totalPrice});


});

router.post('/shop/checkout', isLoggedIn, function(req,res,next) {
  if(!req.session.cart){
    return res.redirect('/mycart');
  }
  var cart = new Cart(req.session.cart);
 
  var order = new Order({
    user: req.user,
    cart: cart,
    address: req.body.address,
    name: req.body.name,
    cardName: req.body.cardName,
    cardNumber: req.body.cardNumber,
    phoneNumber: req.body.phoneNumber

  });
  order.save(function(err, result){
    req.flash('success', 'successfully bought this product');
    console.log(cart.items);

   /* var conditions = { _id:  }
    , update = { $inc: { qty: -1 }}
    , options = { multi: true };

    Product.update(conditions, update, options, callback);*/



    req.session.cart= null;
    res.redirect('/');
  });

});

/*router.post('/items/product', upload.any(), function(req, res, next){
  res.send(req.files);
  res.send(req.body);
});*/

/*router.get('/', function(req,res,next) {

  if(req.query.search){

    Product.find({catagory: req.query.search}, function(err, products){

      if(err) throw err;

      res.render('/index', {title: 'Shopping cart' ,products: products});

    });

  }else{

      Product.find({}, function(err, product) {
          if (err) throw err;

          res.render('/index', {
             title: 'Shopping Cart',
             products: product
            });
      
          //console.log(product);
      });
  }

});*/

function  isLoggedIn(req,res,next) {
  if(req.isAuthenticated()){
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
  // body...
}

module.exports = router;