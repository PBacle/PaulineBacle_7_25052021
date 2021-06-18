const router = require("express").Router();
const postsCtrl = require("../controllers/post");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const {validateBody, validators} = require('../middleware/validator'); 

router.get("/", auth, postsCtrl.getAllPosts);
router.get("/:id",  auth, postsCtrl.getOnePost); 
//router.get("/profiles/:id/liked", auth, postsCtrl.getUserLikedPosts); 
//router.get("/profiles/:id", auth, postsCtrl.getUserPosts); 
router.post("/add", auth,   validateBody(validators.postValidator), multer, postsCtrl.createPost);
router.delete("/:id",  auth, multer, postsCtrl.deletePost);
router.put("/:id", auth, validateBody(validators.postValidator),  multer,  postsCtrl.updatePost);


module.exports = router;

