const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please tell us your name']
    },
    email:{
        type:String,
        required:[true,"Please tell us your email address"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"Please Provide a valid email"]
    },
    photo:{
        type:String,
    },
    password:{
        type:String,
        required:[true,"please provide a password"],
        minlength:8
    },
    passwordConfirm:{
        type:String,
        required:[true,"please confirm your password"],
        minlength:8
    }
})

const userModel = mongoose.model('User',userSchema);

module.exports = userModel;