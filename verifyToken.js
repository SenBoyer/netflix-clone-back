const jwt = require("jsonwebtoken");

function verify(request, response, next) {
  const authHeader = request.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log("token has been split, user about to be jwt verified");
    jwt.verify(token, process.env.ENCRYPT_KEY, (err, user) => {
      if (err) {
        console.log(err);
        return response.status(403).json("error: Token not valid");
      }
      request.user = user;
      next();
    });
  } else {
    return response.status(401).json("not authorized");
  }
}

module.exports = verify;
