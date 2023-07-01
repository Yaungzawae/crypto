const { validationResult } = require("express-validator");
const { formatExpressValidatorError } = require("../helpers/formatError");

module.exports = (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(422).json(formatExpressValidatorError(err.errors));
  }
  next();
};
