const mongoose = require("mongoose");

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

const User = mongoose.model("User", userScheme);

module.exports = {
  User,

};
