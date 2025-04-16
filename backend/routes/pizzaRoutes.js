const express = require('express');
const pizzaController = require('../controllers/pizzaController');
const router = express.Router();

router.get('/all', pizzaController.getAllPizzas);
router.get('/pizza/:id', pizzaController.getPizza);

module.exports = router;