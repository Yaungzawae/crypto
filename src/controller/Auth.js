const {
  formatError,
  formatMongooseUniqueError,
} = require("../helpers/formatError");
const jwt = require("jsonwebtoken");
const { createCookie, getUserId } = require("../helpers/jwt");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const { transporter } = require("../config/nodemailer.config");
const ejs = require("ejs");
const path = require("path");
const { sendMail } = require("../helpers/sendMail");

module.exports.registerUser = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  try {
    const newUser = await User.create({
      email: req.body.email,
      password: hashedPassword,
    });
    res.cookie("jwt", createCookie({ id: user._id }));
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
    res.cookie("jwt", createCookie({ id: user._id }));
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }
};

module.exports.sendPasswordResetUrl = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }, "_id");
    if (!user) {
      return res.status(401).json(formatError({ email: "Unregistered email" }));
    }
    const otp = Math.floor(Math.random() * 6);
    await User.findByIdAndUpdate(user._id, { otp });
    const token = createCookie(
      { id: user._id, password: req.body.password, otp },
      "10m"
    );
    const resetUrl = `${req.protocol}://${req.get("host")}${
      req.originalUrl
    }/verify?token=${token}`;
    const data = await ejs.renderFile(
      path.join(__dirname, "../views/templates/emailTemplate.ejs"),
      { url: resetUrl, imagePath: path.join(__dirname, "../views/Assets") }
    );
    // await transporter.sendMail({
    //   from: process.env.EMAIL,
    //   to: req.body.email,
    //   subject: "PASSWORD RESET",
    //   html: data,
    // });
    sendMail(req.body.email, "Password Reset", data, [
      { filename: "facebook.png", cid: "facebook" },
      { filename: "instagram.png", cid: "instagram" },
      { filename: "twitter.png", cid: "twitter" },
      { filename: "linkedin.png", cid: "linkedin" },
      { filename: "logo.png", cid: "logo" },
      { filename: "forgot_password.png", cid: "forgotPassword" },
    ]);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
  }
};

module.exports.createNewPassword = async (req, res) => {
  const token = req.query.token;
  console.log(!token);
  if (!token) return res.sendStatus(401);

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      console.log(decoded);
      if (err || !decoded) {
        throw new Error("Invaid jwt");
      }
    });
    const { id, password, otp } = jwt.decode(token);
    const user = await User.findByIdAndUpdate(id, { otp: null });
    console.log(user);
    if (user.otp !== otp) return res.sendStatus(401);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.findByIdAndUpdate(id, { password: hashedPassword });
    res.status(201).redirect("/auth/login");
  } catch (err) {
    console.log(err);
    res.sendStatus(401);
  }
};
