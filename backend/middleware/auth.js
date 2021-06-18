const token = require("../middleware/token");

module.exports = (req, res, next) => { 
    try {
        const decodedToken = token.getUserIdFromToken(req);
        if ( !req.body.userId || (req.body.userId && req.body.userId == decodedToken.id) || decodedToken.admin )  {  
            next();
        } else  {
            throw "Vous n'avez pas les droits !";
        }
    } catch (error) {
        return res.status(401).json({ error : "Vous devez être connecté(e) pour accéder à cette page."});
    }
};


