const express= require('express');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const { addCustomer, fetchUser } = require('../controllers/customerControllers');

const router = express.Router();

router.post('/addcustomer',jwtMiddleware, addCustomer);
router.get('/fetchuser',jwtMiddleware, fetchUser);

module.exports= router;