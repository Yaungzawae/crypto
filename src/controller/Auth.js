const {
  formatError,
  formatMongooseUniqueError,
} = require("../helpers/formatError");
const User = require("../model/User");
const bcrypt = require("bcrypt");

module.exports.registerUser = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  try {
    const newUser = await User.create({
      email: req.body.email,
      password: hashedPassword,
    });
    res.sendStatus(201);
  } catch (err) {
    res.json(formatMongooseUniqueError(err.errors));
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json(formatError({ email: "Unregistered email" }));
    }
    const passwordIsCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordIsCorrect) {
      return res
        .status(401)
        .json(formatError({ password: "Incorrect password" }));
    }
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }
};
