const JWT = require("jsonwebtoken");
const config = require("../config/config");

module.exports.issueToken =  function issueToken(user) {
  const id = user.userId;
  const admin = user.admin ;
  const expiresIn = '1H';
  const payload = {
    sub: id,
    adm: admin, 
    iat: Date.now(),
  };
  const signedToken = JWT.sign(payload, config.authentication.jwtSecret, { expiresIn: expiresIn });
  return {
    token: "Bearer " + signedToken,
    expiresIn: expiresIn,
  };
}

module.exports.getUserIdFromToken = function getUserIdFromToken(req) { // this will throw an error if no token exists
  const token = req.headers.authorization.split(" ")[1]; 
  const decodedToken = JWT.verify(token, config.authentication.jwtSecret); 
  return {
    id: decodedToken.sub,
    admin: decodedToken.adm} ; 
}

