const token = require("../middleware/token");

module.exports = (req, res, next) => { 
    try {
        const decodedToken = token.getUserIdFromToken(req); // this will throw an error if no token exists : useful to make sur that nobody can access the pages if not connected 
        if ( !req.body.userId || (req.body.userId && req.body.userId == decodedToken.id) || decodedToken.admin )  {  
            next();
        } else  {
            throw "Vous n'avez pas les droits !";
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error : "Vous devez être connecté(e) pour accéder à cette page."});
    }
};


