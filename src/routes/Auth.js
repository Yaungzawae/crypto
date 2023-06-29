const { registerUser, loginUser } = require("../controller/Auth");
const { userValidator } = require("../validator/userValidator");

const Router = require("express").Router();

Router.post("/register", userValidator, registerUser);

Router.post("/login", userValidator, loginUser);


module.exports = Router;