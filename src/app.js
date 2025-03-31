const express = require("express");
const app = express();
app.use(express.json());
const { validateSignUpData } = require("./utils/validate");

const bcrypt = require("bcrypt");

const { User } = require("./models/user");

const { connectDB } = require("./config/database");

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
 if(!email || !password){
  throw new Error("fill the details!!");
  
 }

    const user = await User.findOne({ email: email });
    if (!user) {``
      res.status(400).send("Inavalid credentails!!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login Successfull!!");
    } else {
      throw new Error("Inavalid Credentials");
    }
  } catch (err) {
    res.status(400).send(`Invalid Data!! Error: ${err.message}`);
  }
});
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const user = await User.find({ email: userEmail });
    if (!user) {
      return res.status(404).send("User email is not found!!");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send(`User email is not found!! Error: ${err.message}`);
  }
});

app.get("/feed", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).send("User email is not found!!");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send(`User email is not found!! Error: ${err.message}`);
  }
});

app.delete("/user", async (req, res) => {
  const deleteUser = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(deleteUser);
    if (!user) {
      res.status(404).send("User is not found!!");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send(`Something went wrong!! Error: ${err.message}`);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req?.params.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATE = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "about",
      "skills",
    ];

    const isUpdateUser = Object.keys(data).every((k) =>
      ALLOWED_UPDATE.includes(k)
    );

    if (!isUpdateUser) {
      throw new Error("Invalid Update!!");
    }

    if (data.skills && data.skills.length > 10) {
      throw new Error("Skills should be less than 10!!");
    }

    const user = await User.findByIdAndUpdate(userId, req.body, {
      runValidators: true,
      new: true,
    });
    console.log(user);

    if (!user) {
      res.status(404).send("User is not found!!");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send(`Something went wrong!! Error: ${err.message}`);
  }
});

app.put("/user", async (req, res) => {
  const replaceUser = req.body.userId;

  try {
    const user = await User.findOneAndReplace({ _id: replaceUser }, req.body);
    if (!user) {
      res.status(404).send("user is not found!!");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send(`Something went wrong!! Error: ${err.message}`);
  }
});

connectDB()
  .then(() => {
    console.log("The database is now connected!!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("The database is not connected!!", err); // Corrected error logging
  });
