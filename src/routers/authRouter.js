const express = require("express");
const { validateSignUpData } = require("../utils/validate");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    //Validate the user
    validateSignUpData(req);
    const { firstName, lastName, email, age, password } = req.body;

    //hash the user password!!
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      email,
      age,
      password: hashedPassword,
    });

    await user.save();
    res.send("User is saved successfully");
  } catch (err) {
    res.status(400).send(`User is not saved!! Error: ${err.message}`); // Updated error message
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("fill the details!!");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send("Inavalid credentails!!");
    }

    const isPasswordValid = await user.validatingPassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();

      // console.log("Token: ", token);

      res.cookie("token", token, { expires: new Date(Date.now() + 900000) }); //t o read the cookies use a npm package named cookie-parser to read the exiting cookie
      res.send("Login Successfull!!");
    } else {
      throw new Error("Inavalid Credentials");
    }
  } catch (err) {
    res.status(400).send(`Invalid Data!! Error: ${err.message}`);
  }
});




authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null , { expires: new Date(Date.now()) });

  res.send("user Logged out successfully!!");
});



module.exports = authRouter;
