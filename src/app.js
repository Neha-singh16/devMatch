const express = require("express");
const app = express();
const cookies = require("cookie-parser"); //to read the cookies we user these npm package!!
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookies());
const { validateSignUpData } = require("./utils/validate");
const { connectDB } = require("./config/database");
const authRouter = require("./routers/authRouter");
const profileRouter = require("./routers/profileRouter");
const requestRouter = require("./routers/requestRouter");


app.use("/" , authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);



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
