const Comment = require('../models/comment');
const token = require("../middleware/token"); 

exports.getComments = async (req, res) => {
  Comment.getAll(req.params.id, function(err, result, fields) {
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
    res.status(200).send(result);
  })
};

exports.addComment = async (req, res) => {
  Comment.createOne(req.params.id,  token.getUserIdFromToken(req).id, req.body.content, function(err, result, fields) {
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
    return res.status(201).json({messageRetour: "Votre commentaire a été publié." });
  })
};

exports.deleteComment = async (req, res) => {
  const id = req.params.id;
  const userToken = token.getUserIdFromToken(req);
  Comment.getOne(id, function(err, result, fields) {
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
    if( result.length > 0){
      const comment = result[0] ;
      if (userToken.id == comment.userId || userToken.admin) {
        Comment.deleteOne(id, function(err, result, field){
          if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
          return res.status(200).json({ messageRetour: "Le commentaire a été supprimé." });
        })          
      }else{
        return res.status(401).send({ error: "Vous n'avez pas les droits." })
      }  
    }else{
      return res.status(404).send({ error: "Commentaire non trouvé." }) 
    }
  })
};

exports.likePost = async (req, res) => {
  const userId = token.getUserIdFromToken(req).id;
  const postId = req.params.id;
  Comment.checkLike(postId, userId, function (err, result, fields) {
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
    if (result.length > 0 ) {
      Comment.dislikePost(postId, userId, function (err, result, fields) {
        if (err) { return res.status(400).json({ err }); }
        res.status(201).send({ messageRetour: "Vous n'aimez plus ce post." });
      })
    }else{
      Comment.likePost(postId, userId, function (err, result, fields) {
        if (err) { return res.status(400).json({ err }); }
        res.status(201).json({ messageRetour: "Vous aimez ce post." });
      })
    }
  })
};
