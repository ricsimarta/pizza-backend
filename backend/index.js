const express = require('express');
const path = require('path');
const pizzaRoutes = require('./routes/pizzaRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => res.sendFile(path.join(`${__dirname}/../frontend/index.html`)));
app.use('/static', express.static(path.join(`${__dirname}/../frontend/static`)));

// localhost:3000/api/pizzas
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});