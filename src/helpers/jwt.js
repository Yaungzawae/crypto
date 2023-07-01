const jwt = require("jsonwebtoken");

module.exports.createCookie = (payload, duration="24h") =>{
    const token = jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn: duration
    });
    return token;
}

module.exports.getUserId = (token)=>{
    return jwt.decode(token).id;
}