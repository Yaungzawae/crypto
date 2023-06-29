const { registerUser, loginUser } = require("../controller/Auth");
const { userValidator, handleUserValidatorResults } = require("../validator/userValidator");

const Router = require("express").Router();

Router.get("/register", userValidator, registerUser);

Router.post("/login", userValidator, loginUser);


module.exports = Router;