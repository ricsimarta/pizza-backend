const path = require('path');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

function getFormattedDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const day = String(now.getDate()).padStart(2, '0');

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports.createNewOrder = async (req, res) => {
  const order = {
    id: uuidv4(),
    date: getFormattedDateTime(),
  }

  const pizzasString = await fs.readFile(`${__dirname}/../pizzas.json`, 'utf8');
  const pizzas = JSON.parse(pizzasString);
  
  let sum = 0;
  const orderedPizzas = [];

  const entries = Object.entries(req.body);
  entries.forEach(([id, qty]) => {
    const foundPizza = pizzas.find(pizza => pizza.id === Number(id));
    
    sum += foundPizza.price * qty;

    orderedPizzas.push({...foundPizza, qty});
  });
  order.sum = sum;
  order.pizzas = orderedPizzas;

  const ordersString = await fs.readFile(`${__dirname}/../orders.json`, 'utf8');
  const orders = JSON.parse(ordersString);
  orders.push(order);

  await fs.writeFile(`${__dirname}/../orders.json`, JSON.stringify(orders, null, 2));

  return res.json({ orderId: order.id });
}

module.exports.getOrder = async (req, res) => {
  const orderId = req.params.id;

  const ordersString = await fs.readFile(`${__dirname}/../orders.json`, 'utf8');
  const orders = JSON.parse(ordersString);

  const foundOrder = orders.find(order => order.id === orderId);

  if (foundOrder) return res.json(foundOrder);

  return res.status(404).json({ message: 'order was not found' });
}