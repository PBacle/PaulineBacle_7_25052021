const JWT = require("jsonwebtoken");
const config = require("../config/config");

module.exports.issueJWT =  function issueToken(user) {
  const id = user.id;
  const expiresIn = "24H";
  const payload = {
    sub: id,
    iat: Date.now(),
  };
  const signedToken = JWT.sign(payload, config.authentication.jwtSecret, { expiresIn: expiresIn });
  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}

module.exports.getUserId = function getUserIdFromToken(req) {
  const token = req.headers.authorization.split(" ")[1]; 
  const decodedToken = JWT.verify(token, config.authentication.jwtSecret); 
  const userId = decodedToken.sub;
  return userId; 
}

