const jwt = require("jsonwebtoken");
const createError = require("http-errors");

function jwtAuthMiddleware(req, res, next) {
  // Capture jwtToken
  const jwtToken =
    req.get("Authorization") || req.query.jwtToken || req.body.jwtToken;

  // Test we have the jwtToken
  if (!jwtToken) {
    const error = createError(401, "no jwtToken provided");
    next(error);
    return;
  }

  // Test the jwtToken is valid
  jwt.verify(jwtToken, process.env.JWT_SECRET, (error, payload) => {
    // if jwtToken is not valid
    if (error) {
      const invalidError = createError(401, "Invalid jwtToken");
      next(invalidError);
      return;
    }

    // Add to request the payload of jwtToken (so it will can be used at next middlewares)
    req.userId = payload.userId;
  });
  next();
}

module.exports = jwtAuthMiddleware;
