require("dotenv").config();
const express = require("express");
const db = require("./config/db.config.js");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/Auth.js");
const { validateCookie } = require("./middlewares/validateCookie.js");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoute);

app.listen(process.env.PORT, ()=>{ 
    console.log(`Server is running on PORT ${process.env.PORT}`)
})