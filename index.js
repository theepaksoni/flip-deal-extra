const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3000;

app.use(express.static('static'));

let cors = require('cors');

app.use(cors());

app.get('/', (req, res) => {
  res.send('Deepak_BD 3.4 - Assignment');
});

let cart = [
  { productId: 1, name: 'Laptop', price: 50000, quantity: 1 },
  { productId: 2, name: 'Mobile', price: 20000, quantity: 2 },
];

function addItemToCart(cart, productId, name, price, quantity) {
  const newItem = {
    productId: productId,
    name: name,
    price: price,
    quantity: quantity,
  };

  cart.push(newItem);
  return cart;
}

app.get('/cart/add', (req, res) => {
  let productId = parseInt(req.query.productId);
  let name = req.query.name;
  let price = parseFloat(req.query.price);
  let quantity = parseInt(req.query.quantity);
  if (!productId || !name || !price || !quantity) {
    return res.status(400).json({
      error:
        'All query parameters are required: productId, name, price, quantity',
    });
  }

  let updatedCart = addItemToCart(cart, productId, name, price, quantity);

  res.json({ cartItems: updatedCart });
});

function updateCartItemsByProductId(cart, productId, quantity) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].productId === productId) {
      cart[i].quantity = quantity;
    }
  }
  return cart;
}

app.get('/cart/edit', (req, res) => {
  let productId = parseInt(req.query.productId);
  let quantity = parseInt(req.query.quantity);
  if (!productId || !quantity) {
    return res.status(400).json({
      error: 'All query parameters are required: productId, quantity',
    });
  }

  let updatedCart = updateCartItemsByProductId(cart, productId, quantity);

  res.json({ cartItems: updatedCart });
});

function deleteCartItemsByProductId(item, productId) {
  return item.productId !== productId;
}

app.get('/cart/delete', (req, res) => {
  let productId = parseInt(req.query.productId);

  cart = cart.filter((item) => deleteCartItemsByProductId(item, productId));

  res.json({ cartItems: cart });
});

app.get('/cart', (req, res) => {
  res.json({ cartItems: cart });
});

function calculateTotalQuantity(cart) {
  let sum = 0;
  for (let i = 0; i < cart.length; i++) {
    sum = sum + cart[i].quantity;
  }
  return sum;
}
app.get('/cart/total-quantity', (req, res) => {
  let totalQuantity = calculateTotalQuantity(cart);
  res.json({ totalQuantity: totalQuantity });
});

function calculateTotalPrice(cart) {
  let sum = 0;
  for (let i = 0; i < cart.length; i++) {
    sum = sum + cart[i].price;
  }
  return sum;
}
app.get('/cart/total-price', (req, res) => {
  let totalprice = calculateTotalPrice(cart);
  res.json({ totalprice: totalprice });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
