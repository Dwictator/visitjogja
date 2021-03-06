const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");

SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const userSchema = new Schema({

   email:{
      type: String,
      required: [true, 'required'],
      unique: [true, 'unique'],
   },

   username: {
      type: String,
      required: [true, 'required'],
      unique: [true, 'duplicated doe'],
      minlength: [4, 'minlength=4']
   },

   password: {
      type: String,
      required: [true, 'required'],
      minlength: 6,

   }
}, {
   timestamps: true,
});

//encrypt
userSchema.pre('save', function (next) {
   var user = this;

   // only hash the password if it has been modified (or is new)
   if (!user.isModified('password')) return next();

   // generate a salt
   bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function (err, hash) {
         if (err) return next(err);
         // override the cleartext password with the hashed one
         user.password = hash;
         next();
      });
   });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
   bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
       if (err) return cb(err);
       cb(null, isMatch);
   });
};




const User = mongoose.model('users', userSchema);

module.exports = User;