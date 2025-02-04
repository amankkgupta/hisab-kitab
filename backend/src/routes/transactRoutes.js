const express = require("express");
const jwtMiddleware = require("../middleware/jwtMiddleware");
const { addTransact, fetchAllTransact, editTransact } = require("../controllers/transactControllers");

const router = express.Router();

router.post('/addtransact', jwtMiddleware, addTransact);
router.post('/fetchalltransact', jwtMiddleware, fetchAllTransact);
router.post('/edittransact',jwtMiddleware, editTransact);

module.exports = router;
