const router = require("express").Router();
const postsCtrl = require("../controllers/posts");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const {validateBody, validators} = require('../middleware/validator'); 

router.get("/", auth, postsCtrl.getAllPosts);
router.get("/profiles/:id", postsCtrl.getUserPosts); /** vir ci dessous */
router.get("/profiles/:id/liked", postsCtrl.getUserLikedPosts); /** Pas de auth sinon on peut pas voir pr les autres */
router.get("/:id", auth, postsCtrl.getOnePost); 
router.post("/add", auth, multer, validateBody(validators.postValidator), postsCtrl.createPost);
router.put("/:id", auth, multer, validateBody(validators.postValidator), postsCtrl.updatePost);
router.delete("/:id", auth, multer, postsCtrl.deletePost);

module.exports = router;

