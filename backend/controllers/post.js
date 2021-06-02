const Post = require('../models/post');


exports.getAllPosts = async (req, res) => {
  Post.getAll(function(err, result, fields) {
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
    return res.status(200).send(result);
  })
};

exports.getUserPosts = async (req, res) => {
  Post.getAllByUSer(req.params.id, function(err, result, fields) {
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
    return res.status(200).send(result);
  })
};

exports.getUserLikedPosts = async (req, res) => {
  Post.getAllLikedByUSer(req.params.id, function(err, result, fields) {
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
    return res.status(200).send(result);
  })
};

exports.getOnePost = async (req, res) => {
  Post.getOne(req.params.id, function(err, result, fields) {
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
    return res.status(200).send(result);
  })
};

exports.createPost = async (req, res) => {
  const userId = token.getUserIdFromToken(req);
  let imgUrl;
  if (req.file) {
    imgUrl = `${req.protocol}://${req.get("host")}/upload/${req.file.filename}`;
  } else {
    imgUrl = null;
  }
  Post.createOne(userId, req.body.title, req.body.content, imgUrl, function (err, result, field) {
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
    return res .status(201) .json({ messageRetour: "Votre post est ajouté" });
  })
};


exports.updatePost = async (req, res) => {
  const id = req.params.id;
  const userId = token.getUserId(req); 
  let newUrl = '';
  Post.getOne(id, function(err, result, fields) { // on trouve le user
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
    if(result.length > 0){
        const post = result[0] ;
        if (userId === post.userId || req.body.admin) {
            if (req.file) {
                if(post.imgUrl){
                    const filename = post.imgUrl.split("/upload")[1];
                    fs.unlink(`upload/${filename}`, (err) => { // s'il y avait déjà une photo on la supprime
                      if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
                      else {
                        console.log(`Deleted file: upload/${filename}`);
                      }
                    });      
                }
                newUrl = `${req.protocol}://${req.get("host")}/upload/${req.file.filename}`;
            }

            let newTitle =  req.body.title ? req.body.title : post.title ;
            let newContent =  req.body.content ? req.body.content : post.content ;
      
            Post.updateOne(id, newTitle, newContent, newUrl,  function(err, result, fields) { // on sauvegarde les changements dans la bdd
                  if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); 
                  } else {
                    res.status(200).json({
                        post: result[0],
                        messageRetour: "Le post a bien été mis à jour",
                      });
                  }
            })
        } else {
            res.status(400).json({ error : "Erreur => Vous n'avez pas les droits requis" });
          }        
    }else{
        return res.status(401).send({ error: "Erreur => Aucun utilisateur trouvé." });    
    }
  }); 
};


exports.deletePost = async (req, res) => {
  const id = req.params.id;
  const userId = token.getUserId(req); 
  Post.getOne(id, function(err, result, fields) {
    if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
    if (result.length > 0) {
      const post = result[0];
      if (userId === post.userId || req.body.admin) {
        if(result[0].imgUrl !== null){
            const filename = result[0].imgUrl.split("/upload")[1];
            fs.unlink(`upload/${filename}`, () => { // sil' y a une photo on la supprime et on supprime le compte
              Post.deleteOne(id, function(err, result, field){
                if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
                res.status(200).json({ messageRetour: "Post supprimé" });                    
                })
            });        
        }else{
          Post.deleteOne(id, function(err, result, field){
            if (err) { return res.status(500).json({ error: "Erreur serveur => " + err }); }
            res.status(200).json({ messageRetour: "Post supprimé" });                    
            })    
        }
      }else{
        res.status(400).json({ error : "Erreur => Vous n'avez pas les droits requis" });
      }
    }else{
      return res.status(401).send({ error: "Erreur => Post non trouvé." });
    }
  })
};

