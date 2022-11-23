const Product = require('../models/product');
const Cart = require('../models/cart');
const product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products=>{
      res.json({products,sucess:true})
      // res.render("shop/product-list",{
      //   prods: products,
      //   pageTitle: "All Products",
      // path: '/products'
      // });
  
    })
    .catch(err=>console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId=req.params.productId;
  Product.findAll({where: {id:prodId}})
  .then(products=>{
    res.render("shop/product-detail",{
      product:products[0],
      pageTitle:products[0].title,
      path:"/product"
    });
  })

    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then(product=>{
    res.render("shop/index",{
      prods:product,
      pageTitle:"Shop",
      path:"/"
    });
  }).catch(err=>console(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.status(200).json({products:products});
         // res.render('shop/cart', {
          //  path: '/cart',
           // pageTitle: 'Your Cart',
           // products: products
         // });
        })
        .catch(err => {
          res.status(400).json({error:true, message: "Error getting cart Items"})
        });
    })
    .catch(err => console.log(err));
};


// exports.postCart = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findById(prodId, product => {
//     Cart.addProduct(prodId, product.price);
//   });
//   res.redirect('/cart');
// };
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.status(200).json({success: true, message:'successfully added to cart'})
      
      //res.redirect('/cart');
    })
    .catch(err => {
      res.status(500).json({success:false, message:'failed to add to cart'})
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
