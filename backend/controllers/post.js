const Post = require('../models/post');
const token = require("../middleware/token"); 
const fs = require("fs");

exports.getAllPosts = async (req, res) => {
  Post.getAll(function(err, result, fields) {
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
   res.status(200).send(result);
  })
};

exports.getOnePost = async (req, res) => {
  Post.getOne(req.params.id, function(err, result, fields) {
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
    if (result.length > 0) {
      const post = result[0] ;
      return res.status(200).send(post);
    } else {
      return res.status(404).send({ error : "Ce post n'existe pas." });
    }

  })
};

exports.createPost = async (req, res) => {
  let imgUrl;
  if (req.file) {
    imgUrl = `${req.protocol}://${req.get("host")}/upload/${req.body.typeFile}s/${req.file.filename}`;
  } else {
    imgUrl = null;
  }
  Post.createOne(req.body.userId, req.body.title, req.body.content, imgUrl, function (err, result, field) {
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
    return res.status(201).json({ 
      messageRetour: "Votre post a été ajouté.",
      post : result 
    });
  })
};

exports.updatePost = async (req, res) => {
  const id = req.params.id;
  const user = token.getUserIdFromToken(req); 
  Post.getOne(id, function(err, result, fields) { // on trouve le user
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
    if(result.length > 0){
        const post = result[0] ;

        if (user.id == post.userId || user.admin) {
          let newTitle =  req.body.title ? req.body.title : post.title ;
          let newContent =  req.body.content ? req.body.content : post.content ;
          let newUrl = post.imgUrl ;
          if (req.file || req.body.deleteImage) { // two cases : change the file or delete the previous one => in any case, need to remove the previous file
                if(post.imgUrl){
                    const filename = post.imgUrl.split(`/upload/${req.body.typeFile}s/`)[1];
                    fs.unlink(`upload/${req.body.typeFile}s/${filename}`, (err) => { // s'il y avait déjà une photo on la supprime
                      if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
                      else {
                        console.log(`Deleted file: upload/${req.body.typeFile}s/${filename}`);
                      }
                    });      
                }
                newUrl = req.file ? `${req.protocol}://${req.get("host")}/upload/${req.body.typeFile}s/${req.file.filename}` : null; 
            }

            Post.updateOne(id, newTitle, newContent, newUrl,  function(err, result, fields) { // on sauvegarde les changements dans la bdd
                  if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); 
                  } else {
                    res.status(200).json({
                        post: result[0],
                        messageRetour: "Le post a bien été mis à jour.",
                      });
                  }
            })
        } else {
            res.status(401).json({ error : "Vous n'avez pas les droits requis." });
          }        
    }else{
        return res.status(404).send({ error: "Aucun utilisateur trouvé." });    
    }
  }); 
};


exports.deletePost = async (req, res) => {
  const id = req.params.id;
  const user = token.getUserIdFromToken(req); 
  Post.getOne(id, function(err, result, fields) {
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
    if (result.length > 0) {
      const post = result[0];
      if (user.id == post.userId  ) {
        if(result[0].imgUrl !== null){ // in case a previous image was posted, it needs to be removed
            const filename = result[0].imgUrl.split(`/upload/${req.body.typeFile}s/`)[1];
            fs.unlink(`upload/${req.body.typeFile}s/${filename}`, () => { 
              Post.deleteOne(id, function(err, result, field){
                if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
                res.status(200).json({ messageRetour: "Le post a été supprimé." });                    
                })
            });        
        }else{
          Post.deleteOne(id, function(err, result, field){
            if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
            res.status(200).json({ messageRetour: "Le post a été supprimé." });                    
            })    
        }
      }else{
        res.status(401).json({ error : "Vous n'avez pas les droits requis." });
      }
    }else{
      return res.status(404).send({ error: "Post non trouvé." });
    }
  })
};

