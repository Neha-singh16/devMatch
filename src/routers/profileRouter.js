const express = require("express");
const { userAuth } = require("../config/middlewares/auth");
const profileRouter = express.Router();
const { validatePassword } = require("../utils/validate");
const bcrypt = require("bcrypt");
const { validateUserFields } = require("../utils/validate");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
  try {
    validateUserFields(req);

    const loggedInUser = req.user;

    console.log(loggedInUser);
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();
    console.log(loggedInUser);
    res.send(`${loggedInUser.firstName} your profile is updated!!`);
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new Error("Please provide all the required feilds!!");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("New Password and confirm Password isn't same!!");
    }

    const loggedInUser = req.user;
    console.log(loggedInUser);
    

    const isMatch = await bcrypt.compare(
      currentPassword,
      loggedInUser.password
    );
    if (!isMatch) {
      throw new Error("InCorrect Password!!");
    }

    const salted = 10;
    const salt = await bcrypt.genSalt(salted);
    const hashingPassword = await bcrypt.hash(newPassword, salt);

    loggedInUser.password = hashingPassword;

    await loggedInUser.save();
    console.log(loggedInUser);
    
    res.send("Password Updated Successfully!!");
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});




module.exports = profileRouter;
