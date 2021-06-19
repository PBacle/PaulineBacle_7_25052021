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
    message: {error : "Trop d'essais infructeux : merci d'attendre 3 minutes avant de recommencer."},
}); 

router.get("/:id", auth,  userCtrl.getUser);
router.delete("/:id", auth, userCtrl.deleteUser);
router.post("/login", limiter, valid, userCtrl.login);
router.post('/signup', validateBody(validators.userValidator), userCtrl.signup); 
router.put("/:id", auth, multer, validateBody(validators.userValidator), userCtrl.updateUser);

module.exports = router;
