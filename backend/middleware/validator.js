const Joi = require('joi'); /* package that will assure validation of data before modifying database */
const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");

module.exports = {
    validators : { /* two validateur Joi objects will be created, one for each model : sauce and user */
      postValidator : Joi.object().keys({
        title: Joi.string() /* here follow different requirement and error messages associated for this data */
                .min(3).message('Le titre doit contenir au moins 3 caractères.')
                .max(100).message('Le titre ne peut pas excéder  100 caractères.')
                .regex(/^[a-z\u00C0-\u017F\d\-_\s\.,\?!;:']+$/i).message('Le titre ne peut contenir que des lettres, des chiffres ou de la ponctuation basique.'),
        content: Joi.string()
                .min(10).message('Et si vous en disiez un peu plus ? (au moins 10 caractères)')
                .max(300).message('Le post ne peut pas excéder 300 caractères.')
                .regex(/^[a-z\u00C0-\u017F\d\-_\s\.,\?!;:']+$/i).message('Le post ne peut contenir que des lettres, des chiffres ou de la ponctuation basique.'),
      }).unknown(true).options({abortEarly : false}), /* this option enables to have all errors and not stop at the first one encountered */

      commentValidator : Joi.object().keys({
          content: Joi.string()
            .required()
            .min(5).message('Et si vous en disiez un peu plus ? (au moins 5 caractères)')
            .max(300).message('Le commentaire ne peut pas excéder 300 caractères.')
            .regex(/^[a-z\u00C0-\u017F\d\-_\s\.,\?!;:']+$/i).message('Le commentaire ne peut contenir que des lettres, des chiffres ou de la ponctuation basique.'),
        }).unknown(true).options({abortEarly : false}),
  
        userValidator : Joi.object().keys({
          email: Joi.string()
                .min(1).message('Une adresse email doit être fournie.')
                .regex(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/).message('Vérifiez le format de l\'adresse email.'),
          password: Joi.string()
                .min(8).message('Le mot de passe doit contenir au moins 8 caractères.')
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=(.*\d){2})[a-zA-Z\d]+$/).message('Le mot de passe doit contenir au moins une majuscule et 2 chiffres, mais pas de caractères spéciaux, ni d\'accents.')
                .invalid('Passw0rd', 'Password123'),
          firstname: Joi.string()
                          .min(0).message('Le prénom doit contenir au moins 1 caractère')
                .max(100).message('Le prénom ne peut pas excéder 100 caractères.')
                .regex(/^[a-z\u00C0-\u017F-]+$/i).message('Le prénom ne peut contenir que des lettres et le tiret (-).'),
          lastname: Joi.string()
                .min(0).message('Le nom doit contenir au moins 1 caractère.')
                .max(100).message('Le nom ne peut pas excéder 100 caractères.')
                .regex(/^[a-z\u00C0-\u017F-]+$/i).message('Le nom ne peut contenir que des lettres et le tiret (-).'),
          pseudo: Joi.string()
                .allow(null, '')
                .max(30).message('Le pseudo ne doit pas excéder 30 caractères.')
                .regex(/^[a-z\u00C0-\u017F0-9_.-]{0,30}$/i).message('Le pseudo ne peut contenir que des lettres, des chiffres ou les caractères suivants : _, - et .'),
          bio: Joi.string()
                .regex(/^[a-z\u00C0-\u017F\d\-_\s\.,\?!;:']+$/i).message('La biographie ne peut contenir que des lettres, des chiffres ou de la ponctuation basique.')
      }).unknown(true).options({abortEarly : false})
    },
  
    validateBody : (validator, model) => {
        return (req, res, next) => {
        const { error } =  model ? validator.validate(JSON.parse(req.body[model])) : validator.validate(req.body) ; 
        const valid = error == null; /* boolean that checks if error contains anything : if not, data is valid */
        
        if (valid) { 
          next(); 
        } else { /* error messages will be displayed in console and error 422 for request will be thrown */
          const { details } = error; 
          console.log(details) ;
          const message = details.map(i => i.message).join("\r\n");       
          console.log("VALIDATION ERROR(s):\n", message); 
          res.status(422).json({ error: message }) } 
      }
    },  


    valid : (req, res, next) => {
      // on vérifie le password et l'email
      const passwordSchema = new passwordValidator();
      passwordSchema
        .is().min(8)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        .has().uppercase()                              // Must have uppercase letters
        .has().lowercase()                              // Must have lowercase letters
        .has().digits(2)                                // Must have at least 2 digits
        .has().not().spaces()                           // Should not have spaces
        .is().not().oneOf(['Passw0rd', 'Password123', 'Azerty123']); 
      
      var msg = "";
      if (
        !emailValidator.validate(req.body.email) ||
        !passwordSchema.validate(req.body.password)
      ) {
        msg = emailValidator.validate(req.body.email) ? msg : msg + "L'adresse mail n'est pas au bon format.\n" ;
        msg = passwordSchema.validate(req.body.password) ? msg : msg + "Le mot de passe n'est pas au bon format (min. 8 characteres avec des minuscules et des majuscules et 2 chiffres).\n" ;
        
        return res.status(422).send({
          error: msg,
        });
      } else  {
        next();
      }
    }
    
  }

