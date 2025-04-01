const cookies = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("invalid token!!");
    }

    const decodeMessage = await jwt.verify(token, "Nain@$123");
    const { _id } = decodeMessage;

    const user = await User.findOne({_id});
    if (!user) {
      throw new Error("Invalid user!!");
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(400).send(`Invalid Data!! Error: ${err.message}`);
  }
};

module.exports = {
  userAuth,
};
