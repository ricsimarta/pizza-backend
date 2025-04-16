const express = require('express');
const path = require('path');
const pizzaRoutes = require('./routes/pizzaRoutes');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => res.sendFile(path.join(`${__dirname}/../frontend/index.html`)));
app.use('/static', express.static(path.join(`${__dirname}/../frontend/static`)));

app.use('/api/pizzas', pizzaRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});