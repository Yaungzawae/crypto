const jwt = require("jsonwebtoken");

module.exports.validateCookie = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.sendStatus(401);
  if (!jwt.verify(token, process.env.JWT_SECRET)) return res.sendStatus(401);
  next();
};
