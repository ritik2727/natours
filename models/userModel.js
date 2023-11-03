const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please tell us your email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please Provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      // this only work on CREATE OR  SAVE !!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'password not same',
    },
    select: false,
  },
  passwordChangedAt:Date,
  role:{
    type:String,
    enum:['user', 'guide','lead-guide','admin'],
    default:'user'
  }

});

userSchema.pre('save', async function (next) {
  // Only run this fun if pwd was actually changed
  if (!this.isModified('password')) return next();

  // hash the password with cost 12

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp){
  if(this.passwordChangedAt){
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);

    return JWTTimestamp < changedTimestamp;
  }

  // False means not change
  return false;
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
