const Comment = require('../models/comment');
const token = require("../middleware/token"); 
const User = require('../models/user');

exports.getComments = async (req, res) => {
  Comment.getAll(req.params.id, function(err, result, fields) {
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
    else if (result.length > 0) {
        res.status(200).send(result);
      } else {
        return res.status(401).json({ error: "Erreur => Aucun commentaire trouvé." });
      }
  })
};

exports.addComment = async (req, res) => {
  Comment.createOne(req.params.id,  token.getUserIdFromToken(req), req.body.content, content, function(err, result, fields) {
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
    return res.status(200).json({messageRetour: "Votre commentaire est publié" });
  })
};

exports.deleteComment = async (req, res) => {
  const id = req.params.id;
  const userId = token.getUserIdFromToken(req);
  Comment.getOne(id, function(err, result, fields) {
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
    if( result.length > 0){
      if (userId === comment.userId || req.body.admin) {
        Comment.deleteOne(id, function(err, result, field){
          if (err) { return res.status(400).json({ err }); }
          return res.status(200).json({ messageRetour: "Commentaire supprimé" });
        })          
      }else{
        return res.status(500).send({ error: "Erreur => Vous n'avez pas les droits." })
      }  
    }else{
      return res.status(401).send({ error: "Erreur => Commentaire non trouvé." }) 
    }
  })
};

exports.likePost = async (req, res) => {
  const userId = token.getUserId(req);
  const postId = req.params.id;
  Comment.checkLike(postId, userId, function (err, result, fields) {
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
    if (result.length > 0 ) {
      Comment.dislikePost(postId, userId, function (err, result, fields) {
        if (err) { return res.status(400).json({ error }); }
        res.status(200).send({ messageRetour: "vou n'aimez plus ce post" });
      })
    }else{
      Comment.likePost(postId, userId, function (err, result, fields) {
        if (err) { return res.status(400).json({ error }); }
        res.status(201).json({ messageRetour: "vous aimez ce post" });
      })
    }
  })
};
