const router = require("express").Router();
const postsCtrl = require("../controllers/post");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const {validateBody, validators} = require('../middleware/validator'); 

router.get("/", auth, postsCtrl.getAllPosts);
router.get("/:id",  auth, postsCtrl.getOnePost); 
router.post("/add", auth,   multer, validateBody(validators.postValidator), postsCtrl.createPost);
router.delete("/:id",  auth, multer, postsCtrl.deletePost);
router.put("/:id", auth, multer, validateBody(validators.postValidator),   postsCtrl.updatePost);


module.exports = router;

