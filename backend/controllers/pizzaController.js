const path = require('path');
const fs = require('fs');

module.exports.getAllPizzas = (req, res) => res.sendFile(path.join(`${__dirname}/../pizzas.json`));

/* /api/pizzas/pizza/:id -> /api/pizzas/pizza/12 */
module.exports.getPizza = (req, res) => {
  const pizzaId = Number(req.params.id);
  
  fs.readFile(`${__dirname}/../pizzas.json`, 'utf8', (err, data) => {
    if (err) return res.json({ message: 'file not found' });
    
    const pizzas = JSON.parse(data);
    const foundPizza = pizzas.find(pizza => pizza.id === pizzaId);

    if (foundPizza) return res.json(foundPizza);

    return res.status(404).json({ message: 'pizza not found' });
  })
}