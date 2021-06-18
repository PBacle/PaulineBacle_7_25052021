const token = require("../middleware/token");

module.exports = (req, res, next) => { 
    try {
        const decodedToken = token.getUserIdFromToken(req);
//        console.log("Authent:", decodedToken, req.body);
        if ( !req.body.userId || (req.body.userId && req.body.userId == decodedToken.id) || decodedToken.admin )  {  
//            console.log("Authent: OK"); // C est pas clair//
            next();
        } else  {
            throw "Vous n'avez pas les droits !";
        }
    } catch (error) {
        return res.status(401).json({ error : "Invalid " + error  });
    }
};


