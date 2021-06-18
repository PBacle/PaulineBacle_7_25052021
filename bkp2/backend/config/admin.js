const User = require('../models/user');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const token = require("../middleware/token"); 
const config = require("../config/config");

// Fonction qui crée le compte admin dans la base de données à la connexion s'il n'existe pas
exports.setAdmin = async  () => {
  return new Promise((resolve)=>{
    User.findAdmin( function (err,results,fields) {
      if(err) { return resolve({status : 500,  error: "Erreur serveur => " + err });    }
      if (results.length > 0) {
        return resolve({
            status:201,
            message: "l'admin est déjà créé",}) 
//            admin :results});
      }else{
        bcrypt.hash(config.admin.password, 10)
        .then((hash) => {
//          const cipherEmail = CryptoJS.AES.encrypt('admin@gmail.com', config.security.cipher).toString();                
          const cipherEmail = "admin@gmail.com" ;

          User.createAdmin('admin', 'admin', 'admin', cipherEmail, hash, function(err, result, fields) {
            if(err) { return resolve({status : 500,  error: "Erreur serveur => " + err });    }
            User.getOne(result.insertId, function (err, newUser, fields) {
              if(err) { return resolve({status : 500,  error: "Erreur serveur => " + err });    }
              const tokenObject =  token.issueToken(newUser);
              return resolve({
                  status: 201, 
                  user: newUser[0],
                  message: `Un compte admin a bien été créé !`,})
            })
          });          
        })          
        .catch((error) => { return resolve({ status: 500, error: "Erreur  => " + error, }) });
      }
    })
  })
}

