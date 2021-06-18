const bcrypt = require('bcrypt');
const token = require("../middleware/token"); 
//const CryptoJS = require('crypto-js');
//const config = require("../config/config");
//const cipherEmail = CryptoJS.AES.encrypt(req.body.email, config.security.cipher).toString();
const User = require('../models/user');
const fs = require("fs");

exports.signup = async (req, res) => {
  User.findOne(req.body.email, function(err, results, fields) {
    if(err) {    return res.status(500).send({ error: "Erreur serveur => " + err });   }
    if (results.length > 0) {
      var msg = '';
      if (results[0].pseudo === req.body.pseudo) { msg = "Pseudo non disponible." }
      if (results[0].email === req.body.email) { msg = msg + "Email non disponible."}
      return res.status(401).json({ error: "Erreur => " + msg });
    } else {
      bcrypt.hash(req.body.password, 10)
      .then(hash =>{
        User.createOne(req.body.pseudo, req.body.firstname, req.body.lastname, req.body.email, hash, function(err, result, fields) {
            if(err) {    return res.status(500).send({ error: "Erreur serveur => " + err });   }
              let newUser = {
                userId : result.insertId, 
                pseudo : req.body.pseudo, 
                admin : null
              }
            const tokenObject = token.issueToken(newUser);
            return res.status(201).send({
                  user: newUser,
                  token: tokenObject.token,
                  expires: tokenObject.expiresIn,
                  message: `Bonjour ${newUser.pseudo}, votre compte a bien été créé !`,
              });
          });          
      })
      .catch(error => res.status(500).json({ error: "Erreur serveur =>" + error }));
    }        
  }, req.body.pseudo)
};

exports.login = async (req, res) => {
  User.findOne(req.body.email, function(err, result, fields) {
      if(err) { return res.status(500).send({ error: "Erreur serveur => " + err });   }
      if (result.length > 0 ) {
        bcrypt.compare(req.body.password, result[0].password) 
          .then(valid => {
              if(!valid){
                  return res.status(401).send({ error: "Mot de passe incorrect." });
              }else{
                  const tokenObject =  token.issueToken(result[0]);
                  return res.status(201).send({
                      user: {
                        userId : result[0].userId,
                        pseudo : result[0].pseudo, 
                        admin : result[0].admin,
                      },
                      token: tokenObject.token,
                      expires: tokenObject.expiresIn,
                      message: "Bonjour " + result[0].pseudo + " !",
                  });        
              }
          })
          .catch(error => res.status(500).json({error: "Erreur serveur => " + error}));
      } else {
          return res.status(404).send({ error: "Utilisateur non trouvé." });
      }
  })
};
  
exports.getUser = async (req, res) => {
  User.getOne(req.params.id, function(err, result, fields) {
    if(err) {    return res.status(500).send({ error: "Erreur serveur => " + err });   }
    if (result.length > 0) {
      const user = result[0] ; 
      user.avatarUrl = user.avatarUrl ? user.avatarUrl : `${req.protocol}://${req.get("host")}/upload/users/default.png` ;
      res.status(201).send(user);
    } else {
      return res.status(404).send({ error : "Cet utilisateur n'existe pas." });
    }
  })
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const user = token.getUserIdFromToken(req);
  if (user.id == id || user.admin) {
    User.getOne(id, function(err, result, fields) { 
      if(err) {    return res.status(500).send({error: "Erreur serveur => " + err  });   }
      if(result.length > 0){
        const user = result[0] ;
        let newAvatar = user.avatarUrl;
        if (req.file || req.body.deleteImage) {
          if(user.avatarUrl){
                const filename = user.avatarUrl.split(`/upload/${req.body.typeFile}s/`)[1];
                fs.unlink(`upload/${req.body.typeFile}s/${filename}`, (err) => {
                  if (err) console.log(err);
                  else {
                    console.log(`Deleted file: upload/${req.body.typeFile}s/${filename}`);
                  }
                });      
            }
            newAvatar = req.file ? `${req.protocol}://${req.get("host")}/upload/${req.body.typeFile}s/${req.file.filename}`:  null;
        }

        newLastname = (req.file || req.body.deleteImage) ? user.lastname : req.body.lastname ;
        newFirstname = (req.file || req.body.deleteImage) ? user.firstname : req.body.firstname ;
        newEmail = (req.file || req.body.deleteImage) ? user.email : req.body.email ;
        newPseudo = (req.file || req.body.deleteImage) ? user.pseudo : 
        ( req.body.pseudo ? req.body.pseudo : null)  ;
        newBio = (req.file || req.body.deleteImage) ? user.bio : (req.body.bio ? req.body.bio : null) ;

        User.updateOne(req.params.id,  newPseudo, newFirstname, newLastname,newEmail, newBio, newAvatar, function(err, result, fields) { 
              if(err) {    return res.status(500).send({error: "Erreur serveur => " + err  });   
              } else {
                res.status(201).json({
                    user: result[0],
                    messageRetour: "Le profil a bien été modifié.",
                  });
              }
        })
      }else{
          return res.status(404).send({ error: "Aucun utilisateur trouvé." });    
      }
    }); 
  } else {
    res.status(401).json({ error: "Vous n'avez pas les droits requis." });
  }        
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const user = token.getUserIdFromToken(req);
  if (user.id == id || user.admin) {
    User.getOne(id, function(err, result, fields) {
      if(err) {    return res.status(500).send({ error: "Erreur serveur => " + err });   }
      if (result.length > 0) {
        if(result[0].avatarUrl){
            const filename = result[0].avatarUrl.split(`/upload/${req.body.typeFile}s/`)[1];
            fs.unlink(`upload/${req.body.typeFile}s/${filename}`, () => { 
              User.deleteOne(id, function(err, result, field){
                if (err) { return res.status(400).json({ error: "Erreur serveur => " + err }); }    
                res.status(200).json({ messageRetour: "Utilisateur supprimé" });                    
                })
            });        
        }else{
            User.deleteOne(id, function(err, result, field){
                if (err) { return res.status(400).json({ error: "Erreur serveur => " + err }) }    
                res.status(200).json({ messageRetour: "Utilisateur supprimé" });                    
            })    
        }
      }else{
        return res.status(404).send({ error: "Utilisateur non trouvé." });
      }
    })
  } else {
    res.status(401).json({ error: "Vous n'avez pas les droits requis" });
  }        
};
  