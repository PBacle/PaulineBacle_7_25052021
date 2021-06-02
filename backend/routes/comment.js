const router = require("express").Router();
const postsComment = require("../controllers/comment");
const auth = require("../middleware/auth");
const {validateBody, validators} = require('../middleware/validator'); 

router.get("/:id/comments", auth, postsComment.getComments);
router.post("/:id/comments", auth, validateBody(validators.commentValidator), postsComment.addComment);
router.delete("/comments/:id", auth, postsComment.deleteComment);
router.post("/:id/like", auth, postsComment.likePost);

module.exports = router;
