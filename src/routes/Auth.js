const { registerUser, loginUser, sendPasswordResetUrl, createNewPassword } = require("../controller/Auth");
const handleValidatorError = require("../middlewares/handleValidatorError");
const { userValidator, emailValidator, passwordValidator } = require("../middlewares/validator/userValidator");

const Router = require("express").Router();

Router.post("/register", userValidator, handleValidatorError, registerUser);

Router.post("/login", userValidator, handleValidatorError, loginUser);

Router.post("/reset-password", userValidator, handleValidatorError, sendPasswordResetUrl);

Router.get("/reset-password/verify", createNewPassword);

module.exports = Router;
