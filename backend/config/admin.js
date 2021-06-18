const User = require('../models/user');
const bcrypt = require('bcrypt');
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
            message: `Un admin existe déjà  (email : ${results[0].email}) `,})
      }else{
        bcrypt.hash(config.admin.password, 10)
        .then((hash) => {
          User.createAdmin('admin', 'admin', 'admin', config.admin.email, hash, function(err, result, fields) {
            if(err) { return resolve({status : 500,  error: "Erreur serveur => " + err });    }
            let newAdmin = {
              userId : result.insertId, 
              pseudo : 'admin', 
              admin : 1
            }
            const tokenObject = token.issueToken(newAdmin);
            return resolve({
              status: 201, 
              user: newAdmin,
              token: tokenObject.token,
              expires: tokenObject.expiresIn,
              message: `Un compte admin a bien été créé !`,
            })
          });          
        })          
        .catch((error) => { return resolve({ status: 500, error: "Erreur  => " + error, }) });
      }
    })
  })
}

