const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: String,
  tokenExp: Number,
});

userSchema.pre("save", function (next) {
  var user = this;
  if (user.isModified("password")) {
    // 비밀번호 암호화 시키기
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

userSchema.methods.generateToken = async function () {
  // jsonwebtoken을 이용해서 token 생성하기
  try {
    var user = this;
    var token = jwt.sign({ _id: user._id }, "secretToken");
    user.token = token;
    await user.save();
    return user;
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
