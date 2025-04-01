const express = require("express");
const app = express();
const cookies = require("cookie-parser"); //to read the cookies we user these npm package!!
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookies());
const { validateSignUpData } = require("./utils/validate");
const { userAuth } = require("./config/middlewares/auth");
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
    if (!email || !password) {
      throw new Error("fill the details!!");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send("Inavalid credentails!!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, "Nain@$123", {
        expiresIn: "0D",
      });

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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

app.post("/sendReq", userAuth, async (req, res) => {
  try {
    res.send("i have sented you a request darling!!! can you please Acceeppppppt me babe??");
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

// app.patch("/user/:userId", async (req, res) => {
//   const userId = req?.params.userId;
//   const data = req.body;
//   try {
//     const ALLOWED_UPDATE = [
//       "firstName",
//       "lastName",
//       "age",
//       "gender",
//       "about",
//       "skills",
//     ];

//     const isUpdateUser = Object.keys(data).every((k) =>
//       ALLOWED_UPDATE.includes(k)
//     );

//     if (!isUpdateUser) {
//       throw new Error("Invalid Update!!");
//     }

//     if (data.skills && data.skills.length > 10) {
//       throw new Error("Skills should be less than 10!!");
//     }

//     const user = await User.findByIdAndUpdate(userId, req.body, {
//       runValidators: true,
//       new: true,
//     });
//     console.log(user);

//     if (!user) {
//       res.status(404).send("User is not found!!");
//     } else {
//       res.send(user);
//     }
//   } catch (err) {
//     res.status(400).send(`Something went wrong!! Error: ${err.message}`);
//   }
// });

// app.put("/user", async (req, res) => {
//   const replaceUser = req.body.userId;

//   try {
//     const user = await User.findOneAndReplace({ _id: replaceUser }, req.body);
//     if (!user) {
//       res.status(404).send("user is not found!!");
//     } else {
//       res.send(user);
//     }
//   } catch (err) {
//     res.status(400).send(`Something went wrong!! Error: ${err.message}`);
//   }
// });

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
