const { check, validationResult } = require("express-validator");
const { formatExpressValidatorError } = require("../helpers/formatError");

module.exports.userValidator = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .bail()
    .isEmail()
    .withMessage("Invalid email address")
    .bail(),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Password cannot be empty")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password needs to be at least six characters")
    .bail(),
  (req, res, next) => {
    const err = validationResult(req);
    console.log(err);
    if (!err.isEmpty()) {
      return res.status(422).json(formatExpressValidatorError(err.errors));
    }
    next();
  },
];
