const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/stocks', stockController.getStocks);
router.get('/stock/:id', stockController.getStockDetails);
router.post('/stocks', stockController.createStock);

module.exports = router;