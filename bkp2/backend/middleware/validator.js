  const Joi = require('joi'); /* package that will assure validation of data before modifying database */
const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");

exports.valid = (req, res, next) => {
  // on vérifie le password et l'email
  const passwordSchema = new passwordValidator();
  passwordSchema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .has().symbols()
    .is().not().oneOf(['Passw0rd', 'Password123', 'Azerty123']); 
  
  if (
    !emailValidator.validate(req.body.email) ||
    !passwordSchema.validate(req.body.password)
  ) {
    return res.status(400).send({
      error:
        "\nMerci de vérifier ton adresse mail, ton mot de passe doit contenir au minum 8 lettres avec des minuscules et majuscules  ",
    });
  } else if (
    emailValidator.validate(req.body.email) ||
    passwordSchema.validate(req.body.password)
  ) {
    next();
  }
};

module.exports = {
    validators : { /* two validateur Joi objects will be created, one for each model : sauce and user */
      postValidator : Joi.object().keys({
        title: Joi.string() /* here follow different requirement and error messages associated for this data */
                .min(3).message('\nThe title should be at least 3 characters.')
                .max(100).message('\nThe title should not exceed 60 characters.')
                .regex(/^[a-z\u00C0-\u017F\d\-_\s\.,\?!;]+$/i).message('\nThe title should containshould contain only letters or digits and basic punctuation.'),
        content: Joi.string()
                .min(10).message('\nBe a little more specific : at least 10 characters to describe your post please :)')
                .max(300).message('\nThe post should not exceed 300 characters.')
                .regex(/^[a-z\u00C0-\u017F\d\-_\s\.,\?!;]+$/i).message('\nThe post should contain only letters or digits and basic punctuation.'),
      }).unknown(true).options({abortEarly : false}), /* this option enables to have all errors and not stop at the first one encountered */

      commentValidator : Joi.object().keys({
          content: Joi.string()
            .min(5).message('\nBe a little more specific : at least 10 characters in your comment please :)')
            .max(300).message('\nThe comment should not exceed 300 characters.')
            .regex(/^[a-z\u00C0-\u017F\d\-_\s\.,\?!;]+$/i).message('\nThe comment should contain only letters or digits and basic punctuation.'),
        }).unknown(true).options({abortEarly : false}),
  
        userValidator : Joi.object().keys({
          email: Joi.string()
                .regex(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/).message('Please give a correct email address.'),
          password: Joi.string()
                .min(8).message('\nThe password should be at least 8 characters.')
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=(.*\d){2})[a-zA-Z\d]+$/).message('\nThe password must contain at least one uppercase character, one lowercase character and one digit, but no special character.')
                .invalid('Passw0rd', 'Password123'),
          firstname: Joi.string()
                .min(1).message('\nThe firstname should be at least 1 characters.')
                .max(100).message('\nThe firstname should not exceed 100 characters.')
                .regex(/^[a-zA-Z-]$/).message('\nThe firstname should contain only characters and -'),
          lastname: Joi.string()
                .min(1).message('\nThe lastname should be at least 1 characters.')
                .max(100).message('\nThe lastname should not exceed 100 characters.')
                .regex(/^[a-zA-Z-]$/).message('\nThe lastname should contain only characters and -'),
          pseudo: Joi.string()
                .min(3).message('\nThe pseudo ingredient should be at least 3 characters.')
                .max(30).message('\nThe pseudo ingredient should not exceed 30 characters.')
                .regex(/^[a-zA-Z0-9_]{3,30}$/).message('\nThe pseudo should contain only characters and digits and _ or .'),
          bio: Joi.string()
                .regex(/^[a-z\u00C0-\u017F\d\-_\s\.,\?!;]+$/i).message('\nThe bio should contain only letters or digits and basic punctuation.')
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
          const message = details.map(i => i.message).join("\r\n");       
          console.log("VALIDATION ERROR(s):", message); 
          res.status(422).json({ error: message }) } 
      }
    }  
  }
