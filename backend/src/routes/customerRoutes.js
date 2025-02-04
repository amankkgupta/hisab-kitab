const express= require('express');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const { addCustomer, fetchAllCustomers } = require('../controllers/customerControllers');

const router = express.Router();

router.post('/addcustomer',jwtMiddleware, addCustomer);
router.get('/fetchallcustomers',jwtMiddleware, fetchAllCustomers);

module.exports= router;