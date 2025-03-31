const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, email, password } = req.body;

  if (!firstName || !email || !password) {
    throw new Error("Please provide all the required feilds!!");
  } else if (!validator.isEmail(email)) {
    throw new Error("Please provide a valid email address!!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be strong use one uppercase letter , one lowercase letter, one number and one  symbol!!"
    );
  }
};


module.exports = {
    validateSignUpData,
}