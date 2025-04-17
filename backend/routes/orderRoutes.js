const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

router.post('/new', orderController.createNewOrder);

module.exports = router;