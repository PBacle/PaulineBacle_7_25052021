const bcrypt = require('bcrypt');
const token = require("../middleware/token"); 
const CryptoJS = require('crypto-js');
const config = require("../config/config");

const User = require('../models/user');
const fs = require("fs");

exports.signup = async (req, res) => {
  //const cipherEmail = CryptoJS.AES.encrypt(req.body.email, config.security.cipher).toString();
  const cipherEmail = req.body.email ;
  User.findOne(cipherEmail, function(err, results, fields) {
    if(err) {    return res.status(500).send({ error: "Erreur serveur => " + err });   }
    if (results.length > 0) {
      var msg = '';
      if (results[0].pseudo === req.body.pseudo) { msg = "Pseudo non disponible." }
      if (results[0].email === cipherEmail) { msg = msg + "Email non disponible."}
      return res.status(400).json({ error: "Erreur => " + msg });
    } else {
      bcrypt.hash(req.body.password, 10)
      .then(hash =>{
          User.createOne(req.body.pseudo, req.body.firstname, req.body.lastname, cipherEmail, hash, function(err, result, fields) {
            if(err) {    return res.status(500).send({ error: "Erreur serveur => " + err });   }
            const tokenObject = token.issueToken(result[0]);
            return res.status(201).send({
                  user: result[0],
                  token: tokenObject.token,
                  expires: tokenObject.expiresIn,
                  message: `Bonjour ${result[0].pseudo}, votre compte a bien été créé !`,
              });
          });          
      })
      .catch(error => res.status(500).json({ error: "Erreur serveur =>" + error }));
    }        
  }, req.body.pseudo)
};

exports.login = async (req, res) => {
//  const cipherEmail = CryptoJS.AES.encrypt(req.body.email, config.security.cipher).toString();
  const cipherEmail = req.body.email ;
  User.findOne(cipherEmail, function(err, result, fields) {
      if(err) {    return res.status(500).send({ error: "Erreur serveur => " + err });   }
      if (result.length > 0 ) {
        bcrypt.compare(req.body.password, result[0].password) 
          .then(valid => {
              if(!valid){
                  return res.status(401).send({ error: "Erreur => Mot de passe incorrect." });
              }else{
                  const tokenObject =  token.issueToken(result[0]);
                  return res.status(200).send({
                      user: {
                        userId : result[0].userId,
                        pseudo : result[0].pseudo, 
                        admin : result[0].admin,
                      },
                      token: tokenObject.token,
                      sub: tokenObject.sub,
                      expires: tokenObject.expiresIn,
                      message: "Bonjour " + result[0].pseudo + " !",
                  });        
              }
          })
          .catch(error => res.status(500).json({error: "Erreur serveur => " + error}));
      } else {
          return res.status(404).send({ error: "Erreur => Utilisateur non trouvé." });
      }
  })
};
  
exports.getUser = async (req, res) => {
  User.getOne(req.params.id, function(err, result, fields) {
    if(err) {    return res.status(500).send({ error: "Erreur serveur => " + err });   }
    if (result.length > 0) {
          res.status(200).send(result[0]);
        } else {
          return res.status(401).send({ error : "Erreur => Utilisateur non trouvé." });
        }
  })
};

exports.getAllUsers = async (req, res) => {
  User.getAll(function(err, result, fields) {
    if(err) {    return res.status(500).send({ error: "Erreur serveur => " + err });   }
    if (result.length > 0) {
        res.status(200).send(result);
      } else {
        return res.status(401).send({ error: "Erreur => Aucun utilisateur trouvé." });
      }
  })
};

/* Améliorations : modifier email + pseudo  */
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const userId = token.getUserIdFromToken(req);
  if (userId === id || req.body.admin) {
    let newAvatar = '';
    User.getOne(id, function(err, result, fields) { 
      if(err) {    return res.status(500).send({error: "Erreur serveur => " + err  });   }
      if(result.length > 0){
        const user = result[0] ;
        if (req.file) {
            if(user.avatarUrl){
                const filename = user.avatarUrl.split("/upload")[1];
                fs.unlink(`upload/${filename}`, (err) => {
                  if (err) console.log(err);
                  else {
                    console.log(`Deleted file: upload/${filename}`);
                  }
                });      
            }
            newAvatar = `${req.protocol}://${req.get("host")}/upload/${req.file.filename}`;
        }

        let newFirstname =  req.body.firstname ? req.body.firstname : user.firstname ;
        let newLastname =  req.body.lastname ? req.body.lastname : user.lastname ;
        let newPseudo =  req.body.pseudo ? req.body.pseudo : user.pseudo ;
        let newBio =  req.body.bio ? req.body.bio : user.bio ;    
        User.updateOne(req.params.id, newFirstname, newLastname, newPseudo, newBio, newAvatar, function(err, result, fields) { 
              if(err) {    return res.status(500).send({error: "Erreur serveur => " + err  });   
              } else {
                res.status(200).json({
                    user: result[0],
                    messageRetour: "Votre profil a bien été modifié",
                  });
              }
        })
      }else{
          return res.status(401).send({ error: "Erreur => Aucun utilisateur trouvé." });    
      }
    }); 
  } else {
    res.status(400).json({ error: "Erreur => Vous n'avez pas les droits requis" });
  }        
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const userId = token.getUserIdFromToken(req);
  if (userId === id || req.body.admin) {
    User.getOne(id, function(err, result, fields) {
      if(err) {    return res.status(500).send({ error: "Erreur serveur => " + err });   }
      if (result.length > 0) {
        if(result[0].avatarUrl !== null){
            const filename = result[0].avatarUrl.split("/upload")[1];
            fs.unlink(`upload/${filename}`, () => { 
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
        return res.status(401).send({ error: "Erreur => Utilisateur non trouvé." });
      }
    })
  } else {
    res.status(400).json({ error: "Erreur => Vous n'avez pas les droits requis" });
  }        
};
  