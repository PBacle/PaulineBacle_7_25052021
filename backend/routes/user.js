const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const {valid, validateBody, validators} = require('../middleware/validator'); 

const rateLimit = require("express-rate-limit"); 
const limiter = rateLimit({
    windowMs: 3 * 60 * 1000, 
    max: 3,
    message: "too much abusive request, wait 3 minutes",
}); 

router.post('/signup', valid, validateBody(validators.userValidator), userCtrl.signup); 
router.post("/login", limiter, valid, userCtrl.login);
router.get("/profiles", auth, userCtrl.getAllUsers);
router.put("/profiles/:id", auth, multer, validateBody(validators.userValidator), userCtrl.updateUser);
router.get("/profiles/:id", auth, userCtrl.getUser);
router.delete("/profiles/:id", auth, userCtrl.deleteUser);

module.exports = router;
