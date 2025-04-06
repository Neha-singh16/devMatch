const validator = require("validator");
const bcrypt = require("bcrypt");

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

const validateUserFields = (req) => {
  const ALLOWED_FIELDS = ["firstName", "email", "age", "about", "skills"];
  const data = req.body;

  if (Object.keys(data).length === 0) {
    throw new Error("No fields provided for update!!");
  }
  const isUpdateUser = Object.keys(data).every((fields) =>
    ALLOWED_FIELDS.includes(fields)
  );

  if (!isUpdateUser) {
    throw new Error("Invalide Update!!");
  }
  // return isUpdateUser;
};



module.exports = {
  validateSignUpData,
  validateUserFields,
 
};
