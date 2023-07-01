const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    },
    otp:{
        type: Number,
        default: null
    }
})

userSchema.plugin(mongooseUniqueValidator,{ message: 'Duplicate {PATH}. Please select another one.' });

const User = mongoose.model("user",userSchema);

module.exports = User;