const router = require('express').Router();
const dashboardController = require('../controller/dashboardController');

router.get('/', dashboardController.getProduct)
router.get('/create', dashboardController.createProduct)
router.get('/edit/:id', dashboardController.editProduct)
router.get('/delete/:id', dashboardController.deleteProduct)

module.exports = router