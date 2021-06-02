const jwt = require('jsonwebtoken');
const token = require("../middleware/token");

module.exports = (req, res, next) => { 
    try {
        const userId = token.getUserIdFromToken(req);         
        if (req.body.userId && (req.body.userId == userId || req.body.admin)) ) {  /* FAIRE QQCHOSE */
            next();
        } else {
            throw "Vous n'avez pas les droits !";
        }
    } catch (error) {
        res.status(401).json({ error: new Error('Invalid request !') });
    }
};


