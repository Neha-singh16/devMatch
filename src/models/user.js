const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userScheme = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 5,
      maxLength: 50,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address!!"],
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 60,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("This is invalid gender input!!");
        }
      },
    },
    about: {
      type: String,
      default: "Hey there! this is an default message...",
      minLength: 30,
      maxLength: 200,
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userScheme.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "Nain@$123", {
    expiresIn: "1D",
  });
  return token;
};

userScheme.methods.validatingPassword = async function (passwordInputByUser) {
  const user = this;
  const hashingPassword = user.password;
  
  const isPasswordValid = await bcrypt.compare(passwordInputByUser, hashingPassword)
  return isPasswordValid;
}

const User = mongoose.model("User", userScheme);

module.exports = {
  User,
};
