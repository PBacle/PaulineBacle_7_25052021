const User = require('../models/user');

const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');

require('dotenv').config();
const token = require("../middleware/token"); 

// Fonction qui crée le compte admin dans la base de données à la connexion s'il n'existe pas
function setAdmin(req, res) {
  User.findAdmin( function (err,results,fields) {
    if(err) {    return res.status(500).send({ error: "Erreur serveur => " + err });   }
    if (results.length > 0) {
        console.log({ message: "l'admin est déjà créé" });
    }else{
        bcrypt.hash(config.admin.Passwd, 10)
          .then((hash) => {
                User.createOneAdmin('admin', 'admin', 'admin', 'admin@gmail.com', hash, function(err, newUser, fields) {
                if(err) {    return res.status(500).send({ error: "Erreur serveur => " + err });   }
                const tokenObject = await token.issueToken(newUser[0]);
                return res.status(201).send({
                      user: newUser[0],
                      token: tokenObject.token,
                      expires: tokenObject.expiresIn,
                      message: `Un compte admin a bien été créé !`,
                  });
              });          
            });          
          .catch((error) => {
              res.status(500).json({ error: "Erreur => " + err });   }
          });
      }

  })
 }
module.exports = setAdmin();
